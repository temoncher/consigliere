import { IGame } from './game.interface';
import { IRound } from './round.interface';

export interface IDetailedGame extends IGame {
  detailed: true;
  rounds: IRound[];
  speechSkips?: Record<string, number>;
}
