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
} from './game.actions';
import { PlayersState } from './players/players.state';
import { SetPlayersNumbers } from './players/players.actions';
import { CurrentDayState } from './current-day/current-day.state';
import { ApplicationStateModel } from '..';
import { GameMenuState } from './menu/menu.state';

export interface GameStateModel {
  days: Day[];
  isNextVotingDisabled: boolean;
}

@State<GameStateModel>({
  name: 'game',
  defaults: {
    days: [],
    isNextVotingDisabled: false,
  },
  children: [
    PlayersState,
    CurrentDayState,
    GameMenuState,
  ],
})
@Injectable()
export class GameState {
  constructor(private store: Store) { }

  @Selector()
  static getDays(state: GameStateModel) {
    return state.days;
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
  startGame({ dispatch }: StateContext<GameStateModel>) {
    return dispatch(new SetPlayersNumbers());
  }

  @Action(ResetIsNextVotingDisabled)
  resetIsNextVotingDisabled({ patchState }: StateContext<GameStateModel>) {
    return patchState({ isNextVotingDisabled: false });
  }

  @Action(DisableNextVote)
  disableNextVote({ patchState }: StateContext<GameStateModel>) {
    return patchState({ isNextVotingDisabled: true });
  }
}
