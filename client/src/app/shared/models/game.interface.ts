
import { GameResult } from '@/graphql/gql.generated';
import { IRound } from '@/table/models/round.interface';

import { ISerializedPlayer } from './player.model';

import { Role } from '~types/enums/role.enum';
import { IQuitPhase } from '~types/interfaces/quit-phase.interface';

export interface IGame {
  club?: string;
  participants: string[]; // playersIds + hostId
  rounds: IRound[];
  result: GameResult;
  players: ISerializedPlayer[];
  roles: Record<string, Role>;
  host: ISerializedPlayer;
  falls?: Record<string, number>;
  quitPhases: Record<string, IQuitPhase>;
  speechSkips?: Record<string, number>;
  createdBy: string;
}
