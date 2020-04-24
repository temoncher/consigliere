import { State, Action, StateContext, Selector, createSelector } from '@ngxs/store';
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
  SwitchDayPhase,
  StartVote,
  ResetCurrentDayPlayerState,
  ShootPlayer,
} from './current-day.actions';
import { KillPlayer } from '../players/players.actions';
import { PlayersState, PlayersStateModel } from '../players/players.state';
import { AddDay } from '../table.actions';

export interface CurrentDayStateModel {
  day: Day;
  finishedPlayers: string[];
  proposedPlayers: Map<string, string>;
  currentPhase: DayPhase;
}

@State<CurrentDayStateModel>({
  name: 'currentDay',
  defaults: {
    day: new Day(),
    finishedPlayers: [],
    proposedPlayers: new Map<string, string>(), // <candidateId, playerId>
    currentPhase: DayPhase.NIGHT,
  },
})
@Injectable()
export class CurrentDayState {
  thisMafiaAlreadyShotText = 'Эта мафия уже сделала выстрел';

  constructor() { }

  @Selector()
  static getDay(state: CurrentDayStateModel) {
    return state.day;
  }

  @Selector()
  static getPhase(state: CurrentDayStateModel) {
    return state.currentPhase;
  }

  @Selector()
  static getIsNextVotingDisabled(state: CurrentDayStateModel) {
    return Boolean(state.day.kickedPlayers.length);
  }

  @Selector()
  static getCurrentVote({ day: { votes } }: CurrentDayStateModel) {
    return votes[votes.length - 1];
  }

  @Selector()
  static getProposedPlayers(state: CurrentDayStateModel) {
    return state.proposedPlayers;
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

  @Action(ResetCurrentDayPlayerState)
  resetCurrentDayPlayerState(
    { patchState, getState }: StateContext<CurrentDayStateModel>,
    { playerId }: ResetCurrentDayPlayerState,
  ) {
    const { day, finishedPlayers } = cloneDeep(getState());

    day.kickedPlayers.filter((kickedPlayerId) => kickedPlayerId !== playerId);
    finishedPlayers.filter((finishedPlayerId) => finishedPlayerId !== playerId);

    return patchState({ day, finishedPlayers });
  }

  @Action(SwitchDayPhase)
  switchDayPhase(
    { patchState }: StateContext<CurrentDayStateModel>,
    { dayPhase }: SwitchDayPhase,
  ) {
    return patchState({ currentPhase: dayPhase });
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

    const proposedPlayers = new Map<string, string>();

    return patchState({ day, finishedPlayers, proposedPlayers });
  }

  @Action(ShootPlayer)
  shootPlayer(
    { patchState, getState }: StateContext<CurrentDayStateModel>,
    { mafiaId, victimId }: ShootPlayer,
  ) {
    const { day } = cloneDeep(getState());

    const thisMafiaVictim = day.shots.get(mafiaId);

    if (thisMafiaVictim) {
      const isShotThisVicitm = thisMafiaVictim === victimId;

      if (!isShotThisVicitm) {
        throw new Error(this.thisMafiaAlreadyShotText);
      }

      day.shots.delete(mafiaId);
      return patchState({ day });
    }

    day.shots.set(mafiaId, victimId);

    return patchState({ day });
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

    day.timers.set(playerId, timeLeft);

    if (!finishedPlayers.includes(playerId)) {
      finishedPlayers.push(playerId);
    }

    return patchState({ day, finishedPlayers });
  }

  @Action(VoteForCandidate)
  voteForCandidate(
    { patchState, getState }: StateContext<CurrentDayStateModel>,
    {
      playerId,
      proposedPlayerId,
    }: VoteForCandidate,
  ) {
    const { day } = cloneDeep(getState());
    const vote = day.votes[day.votes.length - 1];
    const isAlreadyVotedForThisPlayer = vote.get(proposedPlayerId).includes(playerId);

    if (isAlreadyVotedForThisPlayer) {
      vote.set(proposedPlayerId, vote.get(proposedPlayerId).filter((votedPlayerId) => playerId !== votedPlayerId));

      return patchState({ day });
    }

    for (const votedPlayers of vote.values()) {
      votedPlayers.filter((votedPlayerId) => playerId === votedPlayerId);
    }

    vote.set(proposedPlayerId, [...vote.get(proposedPlayerId), playerId]);

    return patchState({ day });
  }

  @Action(StartVote)
  startVote({ dispatch, patchState, getState }: StateContext<CurrentDayStateModel>) {
    const { proposedPlayers, day } = cloneDeep(getState());
    const voteMap = new Map<string, string[]>();

    for (const candidateId of proposedPlayers.keys()) {
      voteMap.set(candidateId, []);
    }

    day.votes.push(voteMap);

    dispatch(new SwitchDayPhase(DayPhase.VOTE));

    return patchState({ day });
  }

  @Action(StartNewDay)
  startNewDay({ dispatch, patchState, getState }: StateContext<CurrentDayStateModel>) {
    const { day } = cloneDeep(getState());

    dispatch(new AddDay(day));

    return patchState({ day: new Day() });
  }
}
