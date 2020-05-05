import { Injectable } from '@angular/core';
import { State, Action, StateContext, createSelector } from '@ngxs/store';
import { cloneDeep } from 'lodash';

import { ToggleGameMenuBoolean } from './menu.actions';

export interface GameMenuStateModel {
  isPlayerControlsVisible: boolean;
  isRolesVisible: boolean;
  isQuittedHidden: boolean;
}

@State<GameMenuStateModel>({
  name: 'gameMenu',
  defaults: {
    isPlayerControlsVisible: true,
    isRolesVisible: false,
    isQuittedHidden: false,
  },
})
@Injectable()
export class GameMenuState {
  constructor() { }

  static getBasicProp(propName: string) {
    return createSelector([GameMenuState], (state: GameMenuStateModel) => {
      if (typeof state[propName] === undefined) {
        throw new Error(`Property '${propName}' does not exist on GameMenuStateModel`);
      }

      return state[propName];
    });
  }

  @Action(ToggleGameMenuBoolean)
  toggleGameMenuBoolean(
    { patchState, getState }: StateContext<GameMenuStateModel>,
    { propName }: ToggleGameMenuBoolean,
  ) {
    const oldPropValue = cloneDeep(getState())[propName];
    const newState = {};
    newState[propName] = !oldPropValue;

    return patchState(newState);
  }
}
