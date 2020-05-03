import { State, Action, StateContext, Selector, createSelector, Store, NgxsOnInit } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';

import { Day } from '@shared/models/table/day.model';
import { DayPhase } from '@shared/models/table/day-phase.enum';
import {
  StopSpeech,
  ProposePlayer,
  WithdrawPlayer,
  KickPlayer,
  SwitchDayPhase,
  ResetCurrentDayPlayerState,
  ShootPlayer,
  EndDay,
  EndVote,
  DisableVote,
  EndNight,
} from './current-day.actions';
import { KillPlayer } from '../players/players.actions';
import { PlayersState, PlayersStateModel } from '../players/players.state';
import { TimersService } from '@shared/services/timers.service';
import { StartVote, SwitchVotePhase } from './current-vote/current-vote.actions';
import { VotePhase } from '@shared/models/table/vote-phase.enum';
import { CurrentVoteState } from './current-vote/current-vote.state';
import { ApplicationStateModel } from '@shared/store';
import { StartNight, DisableNextVote } from '../game.actions';
import { Vote } from '@shared/models/table/vote.model';
import { Navigate } from '@ngxs/router-plugin';

export interface CurrentDayStateModel extends Partial<Day> {
  proposedPlayers: Map<string, string>;
  currentPhase: DayPhase;
}

@State<CurrentDayStateModel>({
  name: 'currentDay',
  defaults: {
    kickedPlayers: [],
    isVoteDisabled: false,
    shots: new Map<string, string>(),
    timers: new Map<string, number>(),

    proposedPlayers: new Map<string, string>(), // <candidateId, playerId>
    currentPhase: DayPhase.NIGHT,
  },
  children: [CurrentVoteState],
})
@Injectable()
export class CurrentDayState implements NgxsOnInit {
  readonly thisMafiaAlreadyShotText = 'Эта мафия уже сделала выстрел';

  constructor(
    private timersService: TimersService,
    private store: Store,
  ) { }

  @Selector()
  static getDay(state: CurrentDayStateModel) {
    return state;
  }

  @Selector()
  static getPhase(state: CurrentDayStateModel) {
    return state.currentPhase;
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

  ngxsOnInit({ patchState }: StateContext<CurrentDayStateModel>) {
    const isNextVotingDisabled = this.store.selectSnapshot((state: ApplicationStateModel) => state.game.isNextVotingDisabled);

    return patchState({ isVoteDisabled: isNextVotingDisabled });
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
    const { kickedPlayers, timers } = cloneDeep(getState());

    kickedPlayers.filter((kickedPlayerId) => kickedPlayerId !== playerId);
    timers.delete(playerId);

    return patchState({ kickedPlayers, timers });
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
    const { kickedPlayers } = cloneDeep(getState());

    kickedPlayers.push(playerId);

    dispatch([
      new KillPlayer(playerId),
      new DisableVote(),
    ]);

    const proposedPlayers = new Map<string, string>();

    return patchState({ kickedPlayers, proposedPlayers });
  }

  @Action(ShootPlayer)
  shootPlayer(
    { patchState, getState }: StateContext<CurrentDayStateModel>,
    { mafiaId, victimId }: ShootPlayer,
  ) {
    const { shots } = cloneDeep(getState());

    const thisMafiaVictim = shots.get(mafiaId);

    if (thisMafiaVictim) {
      const isShotThisVicitm = thisMafiaVictim === victimId;

      if (!isShotThisVicitm) {
        throw new Error(this.thisMafiaAlreadyShotText);
      }

      shots.delete(mafiaId);
      return patchState({ shots });
    }

    shots.set(mafiaId, victimId);

    return patchState({ shots });
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
    const { kickedPlayers, proposedPlayers } = cloneDeep(getState());
    const proposedPlayersList = [...proposedPlayers.keys()];
    const currentDayNumber = this.store.selectSnapshot((state: ApplicationStateModel) => state.game.days).length;

    this.timersService.resetTimers();
    if (!proposedPlayersList.length || kickedPlayers.length) {
      return dispatch([
        new SwitchVotePhase(VotePhase.RESULT),
        new Navigate(['tabs', 'table', 'game', currentDayNumber, 'vote']),
      ]);
    }

    return dispatch([
      new SwitchVotePhase(VotePhase.VOTE),
      new StartVote(proposedPlayersList),
      new Navigate(['tabs', 'table', 'game', currentDayNumber, 'vote']),
    ]);
  }

  @Action(EndNight)
  endNight(
    { dispatch }: StateContext<CurrentDayStateModel>,
  ) {
    const currentDayNumber = this.store.selectSnapshot((state: ApplicationStateModel) => state.game.days).length;

    return dispatch([
      new SwitchDayPhase(DayPhase.DAY),
      new Navigate(['tabs', 'table', 'game', currentDayNumber, 'day']),
    ]);
  }

  @Action(DisableVote)
  disableVote(
    { dispatch, patchState, getState }: StateContext<CurrentDayStateModel>,
  ) {
    const { currentPhase } = cloneDeep(getState());
    const isResultClear = this.store.selectSnapshot(CurrentVoteState.isResultClear);

    if (currentPhase === DayPhase.VOTE && isResultClear) {
      return dispatch(new DisableNextVote());
    }

    return patchState({ isVoteDisabled: true });
  }

  @Action(EndVote)
  endVote(
    { dispatch, patchState }: StateContext<CurrentDayStateModel>,
  ) {
    const vote = this.store.selectSnapshot((state: ApplicationStateModel) => state.game.currentDay.currentVote);

    patchState({ vote: new Vote(vote) });

    return dispatch(new StartNight());
  }
}
