import { Injectable } from '@angular/core';
import { Navigate } from '@ngxs/router-plugin';
import { Store, Actions, ofActionSuccessful } from '@ngxs/store';
import { StateReset } from 'ngxs-reset-plugin';

import { IGame } from '@/shared/models/game.interface';
import { GamesApi } from '@/shared/services/api/games.api';
import { UserState } from '@/shared/store/user/user.state';
import { PlayersService } from '@/table/services/players.service';
import { TimersService } from '@/table/services/timers.service';

import { IRound } from '../models/round.interface';
import { VotePhase } from '../models/vote-phase.enum';
import { SetPlayersNumbers, KillPlayer } from '../store/players/players.actions';
import { PlayersState } from '../store/players/players.state';
import { ResetProposedPlayers } from '../store/round/current-day/current-day.actions';
import { CurrentDayState } from '../store/round/current-day/current-day.state';
import { SetMurderedPlayer } from '../store/round/current-night/current-night.actions';
import { CurrentNightState } from '../store/round/current-night/current-night.state';
import { SetIsVoteDisabled } from '../store/round/current-vote/current-vote.actions';
import { CurrentVoteState } from '../store/round/current-vote/current-vote.state';
import { SwitchRoundPhase, KickPlayer } from '../store/round/round.actions';
import { RoundState } from '../store/round/round.state';
import { SetIsGameStarted, AddRound, EndGame } from '../store/table.actions';
import { TableState } from '../store/table.state';

import { VoteService } from './vote.service';

import { Role } from '~types/enums/role.enum';
import { RoundPhase } from '~types/enums/round-phase.enum';

@Injectable({ providedIn: 'root' })
export class GameService {
  constructor(
    private store: Store,
    private actions$: Actions,
    private voteService: VoteService,
    private timersService: TimersService,
    private playersService: PlayersService,
    private gamesApi: GamesApi,
  ) {
    this.catchPlayerKick();
    this.watchGameEnd();
  }

  startGame() {
    this.timersService.resetTimers();

    this.store.dispatch([
      new SetPlayersNumbers(),
      // new GiveRoles(), // will be useful, when automatic roles shuffle will be implemented
      new Navigate(['tabs', 'table', 'game']),
      new SetIsGameStarted(true),
    ]);
  }

  endNight() {
    const { players, roles, quitPhases } = this.store.selectSnapshot(PlayersState.getState);
    const victimsMap = this.store.selectSnapshot(CurrentNightState.getVictims);
    const aliveMafia = players.filter((player) => {
      const playerRole = roles[player.uid];
      const playerQuitPhase = quitPhases[player.uid];

      return !playerQuitPhase && (playerRole === Role.DON || playerRole === Role.MAFIA);
    });

    let murderedPlayer: string;

    for (const [victimId, mafiaIds] of victimsMap) {
      if (mafiaIds.length === aliveMafia.length) {
        murderedPlayer = victimId;
      }
    }

    if (murderedPlayer) {
      const quitPhase = this.playersService.getQuitPhase();

      this.store.dispatch([
        new KillPlayer(murderedPlayer, quitPhase),
        new SetMurderedPlayer(murderedPlayer),
      ]);
    }

    this.store.dispatch([
      new SwitchRoundPhase(RoundPhase.DAY),
    ]);
  }

  endDay() {
    const proposedPlayers = this.store.selectSnapshot(CurrentDayState.getProposedPlayers);
    const proposedPlayersIds = [...Object.keys(proposedPlayers)];

    this.store.dispatch([
      new SwitchRoundPhase(RoundPhase.VOTE),
    ]);

    this.voteService.switchVotePhase(VotePhase.VOTE);
    this.voteService.startVote(proposedPlayersIds);
  }

  endVote() {
    this.startNewRound();
  }

  dropGame() {
    this.store.dispatch([
      new StateReset(TableState),
      new Navigate(['tabs', 'table']),
    ]);
  }

  saveGame() {
    const newGame = this.composeGame();

    this.gamesApi.create(newGame);

    this.store.dispatch([
      new StateReset(TableState),
      new Navigate(['tabs', 'table']),
    ]);
  }

  private startNewRound() {
    const isVoteDisabled = this.store.selectSnapshot(TableState.getIsNextVotingDisabled);
    const round = this.getCurrentRound();

    this.timersService.resetTimers();

    this.store.dispatch([
      new AddRound(round),
      new StateReset(RoundState),
      new SwitchRoundPhase(RoundPhase.NIGHT),
      new SetIsVoteDisabled(isVoteDisabled),
    ]);
  }

  private getCurrentRound() {
    const currentNight = this.store.selectSnapshot(CurrentNightState);
    const currentDay = this.store.selectSnapshot(CurrentDayState);
    const kickedPlayers = this.store.selectSnapshot(RoundState.getKickedPlayers);
    const currentVote = this.store.selectSnapshot(CurrentVoteState);
    const round: IRound = {
      kickedPlayers,
      ...currentNight,
      ...currentDay,
      ...currentVote,
    };

    return round;
  }

  private composeGame() {
    const { players, falls, quitPhases, speechSkips, roles } = this.store.selectSnapshot(PlayersState.getState);
    const result = this.store.selectSnapshot(TableState.getGameResult);
    const rounds = this.store.selectSnapshot(TableState.getRounds);
    const host = this.store.selectSnapshot(PlayersState.getHost);
    const user = this.store.selectSnapshot(UserState.getState);
    const playersIds = players
      .filter(({ isGuest }) => !isGuest)
      .map(({ uid }) => uid);

    const newGame: IGame = {
      participants: [host.uid, ...playersIds],
      createdBy: user.uid,
      players: players.map((player) => player.serialize()),
      falls,
      roles,
      quitPhases,
      speechSkips,
      host: host.serialize(),
      rounds,
      result,
    };

    return newGame;
  }

  private catchPlayerKick() {
    this.actions$.pipe(
      ofActionSuccessful(KickPlayer),
    ).subscribe(({ playerId }: KickPlayer) => {
      const quitPhase = this.playersService.getQuitPhase();

      this.voteService.disableVote();

      this.store.dispatch([
        new KillPlayer(playerId, quitPhase),
        new ResetProposedPlayers(),
      ]);
    });
  }

  private watchGameEnd() {
    this.actions$.pipe(
      ofActionSuccessful(EndGame),
    ).subscribe(() => {
      const currentRound = this.getCurrentRound();

      this.store.dispatch(new AddRound(currentRound));
    });
  }
}
