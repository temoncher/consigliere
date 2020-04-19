import { TableState, TableStateModel } from './table/table.state';
import { PlayersState, PlayersStateModel } from './table/players/players.state';
import { CurrentDayState, CurrentDayStateModel } from './table/current-day/current-day.state';

interface ExtendedTableStateModel extends TableStateModel {
  players: PlayersStateModel;
  currentDay: CurrentDayStateModel;
}
export interface ApplicationStateModel {
  table: ExtendedTableStateModel;
}

export const ApplicationStates = [
  TableState,
  PlayersState,
  CurrentDayState,
];

