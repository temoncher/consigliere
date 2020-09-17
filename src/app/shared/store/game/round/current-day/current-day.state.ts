import { Injectable } from '@angular/core';
import {
  State, Action, StateContext, Selector, createSelector,
} from '@ngxs/store';
import { Day } from '@shared/models/table/day.interface';
import { cloneDeep } from 'lodash';

import { PlayersState, PlayersStateModel } from '../../players/players.state';

import {
  SetPlayerTimer,
  ProposePlayer,
  WithdrawPlayer,
  ResetPlayerTimer,
  ResetProposedPlayers,
} from './current-day.actions';

// tslint:disable-next-line: no-empty-interface
export type CurrentDayStateModel = Day;

@State<CurrentDayStateModel>({
  name: 'currentDay',
  defaults: {
    timers: new Map<string, number>(),
    proposedPlayers: new Map<string, string>(), // <candidateId, playerId>
  },
})
@Injectable()
export class CurrentDayState {
  @Selector()
  static getFinishedTimers({ timers }: CurrentDayStateModel) {
    return timers;
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

    patchState({ proposedPlayers });
  }

  @Action(ResetPlayerTimer)
  resetPlayerTimer(
    { patchState, getState }: StateContext<CurrentDayStateModel>,
    { playerId }: ResetPlayerTimer,
  ) {
    const { timers } = cloneDeep(getState());

    timers.delete(playerId);

    patchState({ timers });
  }

  @Action(ResetProposedPlayers)
  resetProposedPlayers({ patchState }: StateContext<CurrentDayStateModel>) {
    patchState({ proposedPlayers: new Map<string, string>() });
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

    patchState({ proposedPlayers });
  }

  @Action(SetPlayerTimer)
  setPlayerTimer(
    { patchState, getState }: StateContext<CurrentDayStateModel>,
    { playerId, timeLeft }: SetPlayerTimer,
  ) {
    const { timers } = cloneDeep(getState());

    timers.set(playerId, timeLeft);

    patchState({ timers });
  }
}
