
import { Injectable } from '@angular/core';
import {
  State,
  Action,
  StateContext,
  Selector,
  createSelector,
} from '@ngxs/store';

import { IDay } from '@/table/models/day.interface';

import { PlayersState, PlayersStateModel } from '../../players/players.state';

import {
  SetPlayerTimer,
  ProposePlayer,
  WithdrawPlayer,
  ResetPlayerTimer,
  ResetProposedPlayers,
} from './current-day.actions';

export type CurrentDayStateModel = IDay;

@State<CurrentDayStateModel>({
  name: 'currentDay',
  defaults: {
    timers: {},
    proposedPlayers: {}, // <candidateId, playerId>
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
    return createSelector(
      [CurrentDayState, PlayersState],
      ({ proposedPlayers }: CurrentDayStateModel, { players }: PlayersStateModel) => {
        let foundCandidateId = null;

        for (const [candidateId, proposingPlayerId] of Object.entries(proposedPlayers)) {
          if (playerId === proposingPlayerId) {
            foundCandidateId = candidateId;
          }
        }

        if (foundCandidateId) {
          const foundPlayer = players.find((player) => player.uid === foundCandidateId);

          return foundPlayer;
        }

        return null;
      },
    );
  }

  @Action(ProposePlayer)
  proposePlayer(
    { patchState, getState }: StateContext<CurrentDayStateModel>,
    {
      playerId,
      candidateId,
    }: ProposePlayer,
  ) {
    const { proposedPlayers } = getState();
    const newProposedPlayers = { ...proposedPlayers };

    if (!newProposedPlayers[candidateId]) {
      newProposedPlayers[candidateId] = playerId;
    }

    patchState({ proposedPlayers: newProposedPlayers });
  }

  @Action(ResetPlayerTimer)
  resetPlayerTimer(
    { patchState, getState }: StateContext<CurrentDayStateModel>,
    { playerId }: ResetPlayerTimer,
  ) {
    const { timers } = getState();

    const newTimers = { ...timers };

    delete newTimers[playerId];

    patchState({ timers: newTimers });
  }

  @Action(ResetProposedPlayers)
  resetProposedPlayers({ patchState }: StateContext<CurrentDayStateModel>) {
    patchState({ proposedPlayers: {} });
  }

  @Action(WithdrawPlayer)
  withdrawPlayer(
    { patchState, getState }: StateContext<CurrentDayStateModel>,
    { playerId }: WithdrawPlayer,
  ) {
    const { proposedPlayers } = getState();
    const newProposedPlayers = { ...proposedPlayers };
    let foundCandidateId = null;

    for (const [candidateId, proposingPlayerId] of Object.entries(newProposedPlayers)) {
      if (playerId === proposingPlayerId) {
        foundCandidateId = candidateId;
      }
    }

    if (foundCandidateId) {
      delete proposedPlayers[foundCandidateId];
    }

    patchState({ proposedPlayers });
  }

  @Action(SetPlayerTimer)
  setPlayerTimer(
    { patchState, getState }: StateContext<CurrentDayStateModel>,
    { playerId, timeElapsed }: SetPlayerTimer,
  ) {
    const { timers } = getState();

    const newTimers = {
      ...timers,
      [playerId]: timeElapsed,
    };

    patchState({ timers: newTimers });
  }
}
