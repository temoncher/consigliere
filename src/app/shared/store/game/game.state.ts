import { State, Action, StateContext, Selector, Store } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import { StateReset } from 'ngxs-reset-plugin';

import { Day } from '@shared/models/table/day.model';
import {
  StartGame,
  StartNight,
  DisableNextVote,
  ResetIsNextVotingDisabled,
  DropGame,
} from './game.actions';
import { PlayersState } from './players/players.state';
import { SetPlayersNumbers } from './players/players.actions';
import { CurrentDayState } from './current-day/current-day.state';
import { ApplicationStateModel } from '..';
import { GameMenuState } from './menu/menu.state';
import { Navigate } from '@ngxs/router-plugin';
import { CurrentVoteState } from './current-day/current-vote/current-vote.state';
import { DayPhase } from '@shared/models/table/day-phase.enum';
import { VotePhase } from '@shared/models/table/vote-phase.enum';

export interface GameStateModel {
  days: Day[];
  isNextVotingDisabled: boolean;
  isGameStarted: boolean;
}

@State<GameStateModel>({
  name: 'game',
  defaults: {
    days: [],
    isNextVotingDisabled: false,
    isGameStarted: false,
  },
  children: [
    PlayersState,
    CurrentDayState,
    GameMenuState,
  ],
})
@Injectable()
export class GameState {
  constructor(
    private store: Store,
  ) { }

  @Selector()
  static getDays(state: GameStateModel) {
    return state.days;
  }

  @Selector()
  static getIsGameStarted(state: GameStateModel) {
    return state.isGameStarted;
  }

  @Selector([CurrentDayState.getPhase, CurrentVoteState.getPhase])
  static getCurrentGameStage(
    { days }: GameStateModel,
    dayPhase: DayPhase,
    votePhase: VotePhase,
  ) {
    const dayNumber = days.length;

    return {
      dayNumber,
      dayPhase,
      votePhase,
    };
  }


  @Selector()
  static getDayNumber(state: GameStateModel) {
    return state.days.length;
  }

  @Action(StartNight)
  startNight({ dispatch, patchState, getState }: StateContext<GameStateModel>) {
    const { days } = cloneDeep(getState());
    const finishedDay = this.store.selectSnapshot((state: ApplicationStateModel) => state.game.currentDay);

    if (finishedDay) {
      days.push(new Day(finishedDay));
    }

    dispatch(new StateReset(CurrentDayState));

    return patchState({ days });
  }


  @Action(StartGame)
  startGame({ dispatch, patchState }: StateContext<GameStateModel>) {
    dispatch(new SetPlayersNumbers());

    return patchState({ isGameStarted: true });
  }

  @Action(ResetIsNextVotingDisabled)
  resetIsNextVotingDisabled({ patchState }: StateContext<GameStateModel>) {
    return patchState({ isNextVotingDisabled: false });
  }

  @Action(DisableNextVote)
  disableNextVote({ patchState }: StateContext<GameStateModel>) {
    return patchState({ isNextVotingDisabled: true });
  }

  @Action(DropGame)
  dropGame({ dispatch }: StateContext<GameStateModel>) {
    return dispatch([
      new StateReset(GameState),
      new Navigate(['tabs', 'table']),
    ]);
  }
}
