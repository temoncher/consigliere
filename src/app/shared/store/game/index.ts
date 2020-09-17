import { GameStateModel, GameState } from './game.state';
import { GameMenuStateModel } from './menu/game-menu.model';
import { GameMenuState } from './menu/game-menu.state';
import { PlayersStateModel, PlayersState } from './players/players.state';
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
