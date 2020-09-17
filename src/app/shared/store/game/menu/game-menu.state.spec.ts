import { async } from '@angular/core/testing';
import { StateContext } from '@ngxs/store';

import { GameMenuStateModel } from './game-menu.model';
import { GameMenuState } from './game-menu.state';

interface TestState {
  gameMenu: GameMenuStateModel;
}

describe('[NgXS:Game] Menu', () => {
  let gameMenuState: GameMenuState;

  beforeEach(() => {
    gameMenuState = new GameMenuState();
  });

  it('[Action] should toggle basic prop', () => {
    const mockedStateContext = jasmine.createSpyObj<StateContext<GameMenuStateModel>>('mockedContext', [
      'getState',
      'patchState',
    ]);

    mockedStateContext.getState.and.returnValue({
      isPlayerControlsVisible: true,
    } as GameMenuStateModel);

    gameMenuState.toggleGameMenuBoolean(
      mockedStateContext,
      { propName: 'isPlayerControlsVisible' },
    );

    const expectedState: Partial<GameMenuStateModel> = {
      isPlayerControlsVisible: false,
    };

    expect(mockedStateContext.patchState).toHaveBeenCalledWith(expectedState);
  });

  it('[Selector] should return basic prop', () => {
    const state: GameMenuStateModel = {
      isPlayerControlsVisible: true,
    } as GameMenuStateModel;

    const isPlayerControlsVisible = GameMenuState.getBasicProp('isPlayerControlsVisible')(state);

    expect(isPlayerControlsVisible).toBe(true);
  });
});
