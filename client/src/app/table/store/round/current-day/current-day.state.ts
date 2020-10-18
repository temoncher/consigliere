
import { Injectable } from '@angular/core';
import {
  State,
  Action,
  StateContext,
  Selector,
  createSelector,
} from '@ngxs/store';

import { Player } from '@/shared/models/player.model';
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
  static getFinishedTimers({ timers }: CurrentDayStateModel): Record<string, number> | undefined {
    return timers;
  }

  @Selector()
  static getProposedPlayers({ proposedPlayers }: CurrentDayStateModel): Record<string, string> | undefined {
    return proposedPlayers;
  }

  static getProposedPlayer(playerId: string): (
    dayState: CurrentDayStateModel,
    playersState: PlayersStateModel
  ) => Player | undefined {
    return createSelector(
      [CurrentDayState, PlayersState],
      ({ proposedPlayers }: CurrentDayStateModel, { players }: PlayersStateModel) => {
        let foundCandidateId: string | undefined;

        if (proposedPlayers) {
          for (const [candidateId, proposingPlayerId] of Object.entries(proposedPlayers)) {
            if (playerId === proposingPlayerId) {
              foundCandidateId = candidateId;
            }
          }

          if (foundCandidateId) {
            const foundPlayer = players.find((player) => player.uid === foundCandidateId);

            return foundPlayer;
          }
        }

        return undefined;
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
  ): void {
    const { proposedPlayers } = getState();
    const newProposedPlayers = proposedPlayers ? { ...proposedPlayers } : {};

    if (!newProposedPlayers[candidateId]) {
      newProposedPlayers[candidateId] = playerId;
    }

    patchState({ proposedPlayers: newProposedPlayers });
  }

  @Action(ResetPlayerTimer)
  resetPlayerTimer(
    { patchState, getState }: StateContext<CurrentDayStateModel>,
    { playerId }: ResetPlayerTimer,
  ): void {
    const { timers } = getState();

    const newTimers = timers ? { ...timers } : {};

    delete newTimers[playerId];

    patchState({ timers: newTimers });
  }

  @Action(ResetProposedPlayers)
  resetProposedPlayers({ patchState }: StateContext<CurrentDayStateModel>): void {
    patchState({ proposedPlayers: {} });
  }

  @Action(WithdrawPlayer)
  withdrawPlayer(
    { patchState, getState }: StateContext<CurrentDayStateModel>,
    { playerId }: WithdrawPlayer,
  ): void {
    const { proposedPlayers } = getState();
    const newProposedPlayers = proposedPlayers ? { ...proposedPlayers } : {};
    let foundCandidateId = null;

    for (const [candidateId, proposingPlayerId] of Object.entries(newProposedPlayers)) {
      if (playerId === proposingPlayerId) {
        foundCandidateId = candidateId;
      }
    }

    if (foundCandidateId) {
      delete newProposedPlayers[foundCandidateId];
    }

    patchState({ proposedPlayers: newProposedPlayers });
  }

  @Action(SetPlayerTimer)
  setPlayerTimer(
    { patchState, getState }: StateContext<CurrentDayStateModel>,
    { playerId, timeElapsed }: SetPlayerTimer,
  ): void {
    const { timers } = getState();

    const newTimers = {
      ...timers,
      [playerId]: timeElapsed,
    };

    patchState({ timers: newTimers });
  }
}
