import { GameStateModel, GameState } from './game.state';
import { PlayersStateModel, PlayersState } from './players/players.state';
import { GameMenuStateModel, GameMenuState } from './menu/menu.state';
import { ExtendedCurrentDayStateModel, CurrentDayStates } from './current-day';

export interface ExtendedGameStateModel extends GameStateModel {
  players: PlayersStateModel;
  gameMenu: GameMenuStateModel;
  currentDay: ExtendedCurrentDayStateModel;
}

export const GameStates = [
  ...CurrentDayStates,
  GameState,
  GameMenuState,
  PlayersState,
];
