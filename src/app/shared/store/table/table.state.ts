import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';

import { Day } from '@shared/models/day.model';
import {
  StartNewDay,
} from './table.actions';
import { PlayersState } from './players/players.state';
import { CurrentDayState } from './current-day/current-day.state';

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
  @Selector()
  static getDays(state: TableStateModel) {
    return state.days;
  }

  @Selector()
  static getDayNumber(state: TableStateModel) {
    return state.days.length;
  }

  @Action(StartNewDay)
  startNewDay({ patchState, getState }: StateContext<TableStateModel>) {
    const { days } = cloneDeep(getState());

    days.push(new Day());

    return patchState({ days });
  }
}
