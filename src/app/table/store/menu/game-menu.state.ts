import { Injectable } from '@angular/core';
import {
  State,
  Action,
  StateContext,
  createSelector,
} from '@ngxs/store';
import { cloneDeep } from 'lodash';

import { ToggleGameMenuBoolean } from './game-menu.actions';
import { GameMenuStateModel } from './game-menu.model';

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
  static getBasicProp(propName: keyof GameMenuStateModel) {
    return createSelector([GameMenuState], (state: GameMenuStateModel) => {
      if (typeof state[propName] === 'undefined') {
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
    const { [propName]: oldPropValue } = cloneDeep(getState());

    return patchState({
      [propName]: !oldPropValue,
    });
  }
}
