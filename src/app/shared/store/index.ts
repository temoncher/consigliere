
import { GameStates, ExtendedGameStateModel } from './game';

export interface ApplicationStateModel {
  game: ExtendedGameStateModel;
}

export const ApplicationStates = [
  ...GameStates,
];

