import { GameMenuStateModel } from './menu/game-menu.model';
import { GameMenuState } from './menu/game-menu.state';
import { PlayersStateModel, PlayersState } from './players/players.state';
import { ExtendedRoundStateModel, RoundStates } from './round';
import { TableStateModel, TableState } from './table.state';

export interface ExtendedTableStateModel extends TableStateModel {
  players: PlayersStateModel;
  gameMenu: GameMenuStateModel;
  round: ExtendedRoundStateModel;
}

export const GameStates = [
  PlayersState,
  GameMenuState,
  TableState,
  ...RoundStates,
];
