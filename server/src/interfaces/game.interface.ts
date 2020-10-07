import { IPlayer } from './player.interface';
import { IRound } from './round.interface';

import { GameResult } from '~types/enums/game-result.enum';
import { Role } from '~types/enums/role.enum';
import { IQuitPhase } from '~types/interfaces/quit-phase.interface';

export interface IGame {
  club?: string;
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
