import { GameResult } from '@/table/models/game-result.enum';
import { IRound } from '@/table/models/round.model';

import { ConvertedDeep } from '../helpers/map-to-record-converter';

import { ISerializedPlayer } from './player.model';
import { QuitPhase } from './quit-phase.interface';

export interface Game {
  creatorId: string;
  rounds: ConvertedDeep<IRound>[];
  result: GameResult;
  players: ISerializedPlayer[];
  host: ISerializedPlayer;
  falls: Record<string, number>;
  quitPhases: Record<string, QuitPhase>;
  speechSkips: Record<string, number>;
}
