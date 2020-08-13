import { Injectable } from '@angular/core';
import { Store, Actions, ofActionSuccessful } from '@ngxs/store';
import { Navigate } from '@ngxs/router-plugin';
import { StateReset } from 'ngxs-reset-plugin';

import { KickPlayer, SwitchRoundPhase } from '@shared/store/game/round/round.actions';
import { KillPlayer, SetPlayersNumbers, GiveRoles } from '@shared/store/game/players/players.actions';
import { ResetProposedPlayers } from '@shared/store/game/round/current-day/current-day.actions';
import { AddRound, SetIsGameStarted } from '@shared/store/game/game.actions';
import { GameState } from '@shared/store/game/game.state';
import { CurrentDayState } from '@shared/store/game/round/current-day/current-day.state';
import { RoundPhase } from '@shared/models/table/day-phase.enum';
import { SetIsVoteDisabled } from '@shared/store/game/round/current-vote/current-vote.actions';
import { VotePhase } from '@shared/models/table/vote-phase.enum';
import { PlayersState } from '@shared/store/game/players/players.state';
import { CurrentNightState } from '@shared/store/game/round/current-night/current-night.state';
import { Role } from '@shared/models/role.enum';
import { SetMurderedPlayer } from '@shared/store/game/round/current-night/current-night.actions';
import { CurrentVoteState } from '@shared/store/game/round/current-vote/current-vote.state';
import { Round } from '@shared/models/table/round.model';
import { RoundState } from '@shared/store/game/round/round.state';
import { PlayersService } from './players.service';
import { TimersService } from './timers.service';
import { VoteService } from './vote.service';

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
  ) {
    this.catchPlayerKick();
  }

  startGame() {
    this.timersService.resetTimers();

    this.store.dispatch([
      new SetPlayersNumbers(),
      new GiveRoles(),
      new Navigate(['tabs', 'table', 'game']),
      new SetIsGameStarted(true),
    ]);
  }

  endNight() {
    const roundNumber = this.store.selectSnapshot(GameState.getRoundNumber);
    const players = this.store.selectSnapshot(PlayersState.getPlayers);
    const quitPhases = this.store.selectSnapshot(PlayersState.getQuitPhases);
    const victimsMap = this.store.selectSnapshot(CurrentNightState.getVictims);
    const aliveMafia = players.filter((player) => !quitPhases.has(player.user.id)
      && (player.role === Role.DON || player.role === Role.MAFIA));
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
      new Navigate(['tabs', 'table', 'game', roundNumber, 'day']),
    ]);
  }

  endDay() {
    const roundNumber = this.store.selectSnapshot(GameState.getRoundNumber);
    const proposedPlayers = this.store.selectSnapshot(CurrentDayState.getProposedPlayers);
    const proposedPlayersIds = [...proposedPlayers.keys()];

    this.store.dispatch([
      new SwitchRoundPhase(RoundPhase.VOTE),
      new Navigate(['tabs', 'table', 'game', roundNumber, 'vote']),
    ]);

    this.voteService.switchVotePhase(VotePhase.VOTE);
    this.voteService.startVote(proposedPlayersIds);
  }

  endVote() {
    this.startNewRound();
  }

  dropGame() {
    this.store.dispatch([
      new StateReset(GameState),
      new Navigate(['tabs', 'table']),
    ]);
  }

  private startNewRound() {
    const currentNight = this.store.selectSnapshot(CurrentNightState);
    const currentDay = this.store.selectSnapshot(CurrentDayState);
    const currentVote = this.store.selectSnapshot(CurrentVoteState);
    const roundNumber = this.store.selectSnapshot(GameState.getRoundNumber);
    const isVoteDisabled = this.store.selectSnapshot(GameState.getIsNextVotingDisabled);
    const round = new Round({
      ...currentNight,
      ...currentDay,
      ...currentVote,
    });

    this.timersService.resetTimers();

    this.store.dispatch([
      new AddRound(round),
      new StateReset(RoundState),
      new SwitchRoundPhase(RoundPhase.NIGHT),
      new Navigate(['tabs', 'table', 'game', roundNumber + 1, 'night']),
      new SetIsVoteDisabled(isVoteDisabled),
    ]);
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
}
