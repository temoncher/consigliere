import { Injectable } from '@angular/core';
import { Navigate } from '@ngxs/router-plugin';
import { Store, Actions, ofActionSuccessful } from '@ngxs/store';
import { StateReset } from 'ngxs-reset-plugin';

import { CreateGameGQL, CreateGameMutationVariables, ProfilePageDocument } from '@/graphql/gql.generated';
import { AuthService } from '@/shared/services/auth.service';
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
import { AddRound, EndGame } from '../store/table.actions';
import { TableState } from '../store/table.state';

import { VoteService } from './vote.service';

import { Role } from '~types/enums/role.enum';
import { RoundPhase } from '~types/enums/round-phase.enum';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  constructor(
    private store: Store,
    private actions$: Actions,
    private voteService: VoteService,
    private timersService: TimersService,
    private playersService: PlayersService,
    private createGameGQL: CreateGameGQL,
    private authService: AuthService,
  ) {
    this.watchPlayerKick();
    this.watchGameEnd();
  }

  startGame(): void {
    this.store.dispatch([
      new SetPlayersNumbers(),
      // new GiveRoles(), // will be useful, when automatic roles shuffle will be implemented
      new Navigate(['tabs', 'table', 'game']),
    ]);
  }

  endNight(): void {
    const { players, roles, quitPhases } = this.store.selectSnapshot(PlayersState.getState);
    const victimsMap = this.store.selectSnapshot(CurrentNightState.getVictims);
    const aliveMafia = players.filter((player) => {
      const playerRole = roles[player.uid];
      const playerQuitPhase = quitPhases[player.uid];

      return !playerQuitPhase && (playerRole === Role.DON || playerRole === Role.MAFIA);
    });

    let murderedPlayer: string | undefined;

    for (const [victimId, mafiaIds] of victimsMap.entries()) {
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

  endDay(): void {
    const proposedPlayers = this.store.selectSnapshot(CurrentDayState.getProposedPlayers) || {};
    const proposedPlayersIds = [...Object.keys(proposedPlayers)];

    this.store.dispatch([
      new SwitchRoundPhase(RoundPhase.VOTE),
    ]);

    this.voteService.switchVotePhase(VotePhase.VOTE);
    this.voteService.startVote(proposedPlayersIds);
  }

  endVote(): void {
    this.startNewRound();
  }

  dropGame(): void {
    this.store.dispatch([
      new StateReset(TableState),
      new Navigate(['tabs', 'table']),
    ]);
  }

  saveGame(): void {
    const newGame = this.composeGame();
    const curretUserId = this.authService.currentUser?.uid;

    this.createGameGQL.mutate(
      { game: newGame },
      {
        refetchQueries: [{
          query: ProfilePageDocument,
          variables: {
            id: curretUserId,
          },
        }],
      },
    ).subscribe(() => {
      this.store.dispatch([
        new StateReset(TableState),
        new Navigate(['tabs', 'table']),
      ]);
    });
  }

  private startNewRound(): void {
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

  private getCurrentRound(): IRound {
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

  private composeGame(): CreateGameMutationVariables['game'] {
    const { players, falls, quitPhases, roles } = this.store.selectSnapshot(PlayersState.getState);
    const result = this.store.selectSnapshot(TableState.getGameResult);
    const { club, title, date } = this.store.selectSnapshot(TableState.getTableMeta);
    const host = this.store.selectSnapshot(PlayersState.getHost);

    if (!host) throw new Error('Host is missing');

    if (!result) throw new Error('Game result is missing');

    const newGame: CreateGameMutationVariables['game'] = {
      title,
      club,
      date: new Date(date).getTime(),
      // TODO: populate `triple`,  `donChecks`, `sheriffChecks` and `votes` with real values
      triple: [],
      donChecks: [],
      sheriffChecks: [],
      votes: {},
      players: players.map((player) => player.serialize()),
      falls,
      roles,
      quitPhases,
      host: host.serialize(),
      result,
    };

    return newGame;
  }

  private watchPlayerKick(): void {
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

  private watchGameEnd(): void {
    this.actions$.pipe(
      ofActionSuccessful(EndGame),
    ).subscribe(() => {
      const currentRound = this.getCurrentRound();

      this.store.dispatch(new AddRound(currentRound));
    });
  }
}
