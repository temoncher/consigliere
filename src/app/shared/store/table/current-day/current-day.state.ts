import { State, Action, StateContext, Selector, Store, createSelector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';

import { Day } from '@shared/models/day.model';
import { DayPhase } from '@shared/models/day-phase.enum';
import {
  StopSpeech,
  VoteForCandidate,
  ProposePlayer,
  WithdrawPlayer,
  KickPlayer,
  StartNewDay,
} from './current-day.actions';
import { KillPlayer } from '../players/players.actions';
import { PlayersState, PlayersStateModel } from '../players/players.state';
import { AddDay } from '../table.actions';

export interface CurrentDayStateModel {
  day: Day;
  isNextVotingDisabled: boolean;
  finishedPlayers: string[];
  currentPhase: DayPhase;
}

@State<CurrentDayStateModel>({
  name: 'currentDay',
  defaults: {
    day: new Day(),
    isNextVotingDisabled: false,
    finishedPlayers: [],
    currentPhase: DayPhase.DAY,
  },
})
@Injectable()
export class CurrentDayState {
  constructor(private store: Store) { }

  @Selector()
  static getDay(state: CurrentDayStateModel) {
    return state.day;
  }

  @Selector()
  static getPhase(state: CurrentDayStateModel) {
    return state.currentPhase;
  }

  static getProposedPlayer(playerId: string) {
    return createSelector([CurrentDayState, PlayersState], ({ day }: CurrentDayStateModel, { players }: PlayersStateModel) => {
      const proposedPlayers = day.proposedPlayers;
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
    const { day } = cloneDeep(getState());

    if (!day.proposedPlayers.has(candidateId)) {
      day.proposedPlayers.set(candidateId, playerId);
    }

    return patchState({ day });
  }

  @Action(WithdrawPlayer)
  withdrawPlayer(
    { patchState, getState }: StateContext<CurrentDayStateModel>,
    { playerId }: WithdrawPlayer,
  ) {
    const { day } = cloneDeep(getState());
    const proposedPlayers = day.proposedPlayers;
    let foundCandidateId = null;

    for (const [candidateId, proposingPlayerId] of proposedPlayers.entries()) {
      if (playerId === proposingPlayerId) {
        foundCandidateId = candidateId;
      }
    }

    if (foundCandidateId) {
      proposedPlayers.delete(foundCandidateId);
    }

    return patchState({ day });
  }

  @Action(KickPlayer)
  kickPlayer(
    { dispatch, patchState, getState }: StateContext<CurrentDayStateModel>,
    { playerId }: KickPlayer,
  ) {
    const { day, finishedPlayers } = cloneDeep(getState());

    day.kickedPlayers.push(playerId);

    if (!finishedPlayers.includes(playerId)) {
      finishedPlayers.push(playerId);
    }

    dispatch(new KillPlayer(playerId));

    return patchState({ day, finishedPlayers, isNextVotingDisabled: true });
  }

  @Action(StopSpeech)
  stopSpeech(
    { patchState, getState }: StateContext<CurrentDayStateModel>,
    {
      playerId,
      timeLeft,
    }: StopSpeech,
  ) {
    const { day, finishedPlayers } = cloneDeep(getState());

    day.timers[playerId] = timeLeft;

    if (!finishedPlayers.includes(playerId)) {
      finishedPlayers.push(playerId);
    }

    return patchState({ day, finishedPlayers });
  }

  @Action(VoteForCandidate)
  voteForPerson(
    { patchState, getState }: StateContext<CurrentDayStateModel>,
    {
      playerIds,
      proposedPlayerId,
    }: VoteForCandidate,
  ) {
    const { day } = cloneDeep(getState());

    if (proposedPlayerId) {
      if (!day.votes[0]) {
        day.votes.push(new Map<string, string[]>());
      }

      const vote = day.votes[0];

      for (const votedPlayers of vote.values()) {
        votedPlayers.filter((votedPlayerId) => playerIds.includes(votedPlayerId));
      }

      vote[proposedPlayerId] = playerIds;
    }

    return patchState({ day });
  }

  @Action(StartNewDay)
  startNewDay({ dispatch, patchState, getState }: StateContext<CurrentDayStateModel>) {
    const { day } = cloneDeep(getState());

    dispatch(new AddDay(day));

    return patchState({ day: new Day() });
  }
}
