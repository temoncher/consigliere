import { GameMenuStateModel } from './game-menu.model';

export class ToggleGameMenuBoolean {
  static readonly type = '[Game.Menu] Switch game menu boolean';
  constructor(public propName: keyof GameMenuStateModel) { }
}
