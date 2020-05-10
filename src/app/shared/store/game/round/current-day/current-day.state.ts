import { State, Action, StateContext, Selector, createSelector, Store } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { Navigate } from '@ngxs/router-plugin';
import { cloneDeep } from 'lodash';

import { Day } from '@shared/models/table/day.interface';
import { VotePhase } from '@shared/models/table/vote-phase.enum';
import { ApplicationStateModel } from '@shared/store';
import { TimersService } from '@shared/services/timers.service';

import {
  StopSpeech,
  ProposePlayer,
  WithdrawPlayer,
  ResetPlayerTimer,
  EndDay,
  ResetProposedPlayers,
} from './current-day.actions';
import { PlayersState, PlayersStateModel } from '../../players/players.state';
import { StartVote, SwitchVotePhase } from '../current-vote/current-vote.actions';
import { SwitchRoundPhase } from '../round.actions';
import { RoundPhase } from '@shared/models/table/day-phase.enum';

// tslint:disable-next-line: no-empty-interface
export interface CurrentDayStateModel extends Day { }

@State<CurrentDayStateModel>({
  name: 'currentDay',
  defaults: {
    timers: new Map<string, number>(),
    proposedPlayers: new Map<string, string>(), // <candidateId, playerId>
  },
})
@Injectable()
export class CurrentDayState {
  constructor(
    private timersService: TimersService,
    private store: Store,
  ) { }

  @Selector()
  static getDay(state: CurrentDayStateModel) {
    return state;
  }

  @Selector()
  static getProposedPlayers({ proposedPlayers }: CurrentDayStateModel) {
    return proposedPlayers;
  }

  static getProposedPlayer(playerId: string) {
    return createSelector([CurrentDayState, PlayersState], ({ proposedPlayers }: CurrentDayStateModel, { players }: PlayersStateModel) => {
      let foundCandidateId = null;

      for (const [candidateId, proposingPlayerId] of proposedPlayers.entries()) {
        if (playerId === proposingPlayerId) {
          foundCandidateId = candidateId;
        }
      }

      if (foundCandidateId) {
        const foundPlayer = players.find((player) => player.user.id === foundCandidateId);

        return foundPlayer;
      }

      return null;
    });
  }

  @Action(ProposePlayer)
  proposePlayer(
    { patchState, getState }: StateContext<CurrentDayStateModel>,
    {
      playerId,
      candidateId,
    }: ProposePlayer,
  ) {
    const { proposedPlayers } = cloneDeep(getState());

    if (!proposedPlayers.has(candidateId)) {
      proposedPlayers.set(candidateId, playerId);
    }

    return patchState({ proposedPlayers });
  }

  @Action(ResetPlayerTimer)
  resetPlayerTimer(
    { patchState, getState }: StateContext<CurrentDayStateModel>,
    { playerId }: ResetPlayerTimer,
  ) {
    const { timers } = cloneDeep(getState());

    timers.delete(playerId);

    return patchState({ timers });
  }

  @Action(ResetProposedPlayers)
  resetProposedPlayers({ patchState }: StateContext<CurrentDayStateModel>) {
    return patchState({ proposedPlayers: new Map<string, string>() });
  }

  @Action(WithdrawPlayer)
  withdrawPlayer(
    { patchState, getState }: StateContext<CurrentDayStateModel>,
    { playerId }: WithdrawPlayer,
  ) {
    const { proposedPlayers } = cloneDeep(getState());
    let foundCandidateId = null;

    for (const [candidateId, proposingPlayerId] of proposedPlayers.entries()) {
      if (playerId === proposingPlayerId) {
        foundCandidateId = candidateId;
      }
    }

    if (foundCandidateId) {
      proposedPlayers.delete(foundCandidateId);
    }

    return patchState({ proposedPlayers });
  }

  @Action(StopSpeech)
  stopSpeech(
    { patchState, getState }: StateContext<CurrentDayStateModel>,
    { playerId }: StopSpeech,
  ) {
    const { timers } = cloneDeep(getState());
    const playerTimer = this.timersService.getPlayerTimer(playerId);
    playerTimer.endSpeech();
    const timeLeft = playerTimer.time;

    timers.set(playerId, timeLeft);

    return patchState({ timers });
  }

  @Action(EndDay)
  endDay(
    { dispatch, getState }: StateContext<CurrentDayStateModel>,
  ) {
    const { proposedPlayers } = cloneDeep(getState());
    const proposedPlayersList = [...proposedPlayers.keys()];
    const currentDayNumber = this.store.selectSnapshot((state: ApplicationStateModel) => state.game.rounds).length;

    return dispatch([
      new SwitchRoundPhase(RoundPhase.DAY),
      new SwitchVotePhase(VotePhase.VOTE),
      new StartVote(proposedPlayersList),
      new Navigate(['tabs', 'table', 'game', currentDayNumber, 'vote']),
    ]);
  }
}
