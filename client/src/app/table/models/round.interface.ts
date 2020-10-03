import { IDay } from './day.interface';
import { INight } from './night.interface';
import { IVote } from './vote.interface';

export interface IRound extends INight, IDay, IVote {
  kickedPlayers?: string[];
}
