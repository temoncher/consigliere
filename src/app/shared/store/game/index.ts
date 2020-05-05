import { GameStateModel, GameState } from './game.state';
import { PlayersStateModel, PlayersState } from './players/players.state';
import { GameMenuStateModel, GameMenuState } from './menu/menu.state';
import { ExtendedRoundStateModel, RoundStates } from './round';

export interface ExtendedGameStateModel extends GameStateModel {
  players: PlayersStateModel;
  gameMenu: GameMenuStateModel;
  round: ExtendedRoundStateModel;
}

export const GameStates = [
  PlayersState,
  GameMenuState,
  GameState,
  ...RoundStates,
];
