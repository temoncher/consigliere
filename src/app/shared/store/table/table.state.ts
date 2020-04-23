import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';

import { Day } from '@shared/models/day.model';
import {
  AddDay, StartGame,
} from './table.actions';
import { PlayersState } from './players/players.state';
import { CurrentDayState } from './current-day/current-day.state';
import { SetPlayersNumbers } from './players/players.actions';

export interface TableStateModel {
  days: Day[];
}

@State<TableStateModel>({
  name: 'table',
  defaults: {
    days: [],
  },
  children: [
    PlayersState,
    CurrentDayState,
  ],
})
@Injectable()
export class TableState {
  constructor() { }

  @Selector()
  static getDays(state: TableStateModel) {
    return state.days;
  }

  @Selector()
  static getDayNumber(state: TableStateModel) {
    return state.days.length;
  }

  @Action(AddDay)
  addNewDay(
    { patchState, getState }: StateContext<TableStateModel>,
    { day }: AddDay) {
    const { days } = cloneDeep(getState());

    days.push(day);

    return patchState({ days });
  }

  @Action(StartGame)
  startGame({ dispatch }: StateContext<TableStateModel>) {
    dispatch(new SetPlayersNumbers());
  }
}
