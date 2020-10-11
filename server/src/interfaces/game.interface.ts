import * as fbAdmin from 'firebase-admin';

import { IPlayer } from './player.interface';

import { GameResult } from '~types/enums/game-result.enum';
import { Role } from '~types/enums/role.enum';
import { IQuitPhase } from '~types/interfaces/quit-phase.interface';

export interface IGame {
  club?: string;

  detailed: boolean;
  gameNumber: number;
  date: fbAdmin.firestore.Timestamp;
  host: IPlayer;
  bestTurn?: [number, number, number];
  result: GameResult;
  players: IPlayer[];
  falls?: Record<string, number>;
  quitPhases: Record<string, IQuitPhase>;
  /** <candidatePlayerId, votesNumber> */
  votes?: Record<string, number[]>[];
  roles: Record<string, Role>;
  donChecks?: string[];
  sheriffChecks?: string[];
}
