import { IPlayer } from './player.interface';
import { IQuitPhase } from './quit-phase.interface';
import { IRound } from './round.interface';

import { GameResult } from '~/types/game-result.enum';
import { Role } from '~/types/role.enum';

export interface IGame {
  id?: string;
  participants: string[];
  creatorId: string;
  rounds: IRound[];
  result: GameResult;
  players: IPlayer[];
  roles: Record<string, Role>;
  host: IPlayer;
  falls?: Record<string, number>;
  quitPhases: Record<string, IQuitPhase>;
  speechSkips?: Record<string, number>;
}
