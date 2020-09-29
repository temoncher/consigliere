import { GameResult } from '@/table/models/game-result.enum';
import { IRound } from '@/table/models/round.model';

import { ISerializedPlayer } from './player.model';
import { IQuitPhase } from './quit-phase.interface';
import { Role } from './role.enum';

export interface IGame {
  creatorId: string;
  rounds: IRound[];
  result: GameResult;
  players: ISerializedPlayer[];
  roles: Record<string, Role>;
  host: ISerializedPlayer;
  falls: Record<string, number>;
  quitPhases: Record<string, IQuitPhase>;
  speechSkips: Record<string, number>;
}
