import * as fbAdmin from 'firebase-admin';

import { IFireStorePlayer } from './player.interface';
import { IFireStoreRound } from './round.interface';

import { GameResult } from '~types/enums/game-result.enum';
import { Role } from '~types/enums/role.enum';
import { IQuitPhase } from '~types/interfaces/quit-phase.interface';

export interface IFireStoreGame {
  club?: string;

  gameNumber: number;
  date: fbAdmin.firestore.Timestamp;
  host: IFireStorePlayer;
  triple: [string, string, string];
  result: GameResult;
  players: IFireStorePlayer[];
  falls: Record<string, number>;
  quitPhases: Record<string, IQuitPhase>;
  /** <candidatePlayerId, votesNumber[]> */
  votes: Record<string, number[]>[];
  roles: Record<string, Role>;
  donChecks: string[];
  sheriffChecks: string[];

  /** details */
  rounds?: IFireStoreRound[];
}
