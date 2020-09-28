import { ISerializable } from '@/shared/models/serializable.interface';

import { Day } from './day.interface';
import { Night } from './night.interface';
import { VoteResult } from './vote-result.enum';
import { Vote } from './vote.interface';

export interface IRound extends Night, Day, Vote {
  kickedPlayers: string[];
  // Night
  shots: Map<string, string>; // <mafiaId, playerId>
  murderedPlayer?: string; // murdered player id
  donCheck?: string; // id of player checked by Don
  sheriffCheck?: string; // id of player checked by Sheriff

  // Day
  timers: Map<string, number>; // <playerId, timeLeft>
  proposedPlayers?: Map<string, string>; // <candidateId, playerId>

  // Vote
  isVoteDisabled: boolean;
  votes: Map<string, string[]>[]; // <candidatePlayerId, votePlayerId[]>, multiple votes can occur on ties
  eliminateAllVote?: Map<string, boolean>;
  voteResult: VoteResult;
}

export class Round implements IRound, ISerializable<IRound> {
  kickedPlayers: string[];
  // Night
  shots: Map<string, string>; // <mafiaId, playerId>
  murderedPlayer?: string; // murdered player id
  donCheck?: string; // id of player checked by Don
  sheriffCheck?: string; // id of player checked by Sheriff

  // Day
  timers: Map<string, number>; // <playerId, timeLeft>
  proposedPlayers?: Map<string, string>; // <candidateId, playerId>

  // Vote
  isVoteDisabled = false;
  votes: Map<string, string[]>[]; // <candidatePlayerId, votePlayerId[]>, multiple votes can occur on ties
  eliminateAllVote?: Map<string, boolean>;
  voteResult: VoteResult;

  constructor(partialDay?: Partial<Round>) {
    this.kickedPlayers = partialDay?.kickedPlayers || [];

    this.shots = partialDay?.shots || new Map<string, string>();
    this.murderedPlayer = partialDay?.murderedPlayer;
    this.donCheck = partialDay?.donCheck;
    this.sheriffCheck = partialDay?.sheriffCheck;

    this.timers = partialDay?.timers || new Map<string, number>();
    this.proposedPlayers = partialDay?.proposedPlayers;

    this.isVoteDisabled = partialDay?.isVoteDisabled || false;
    this.votes = partialDay?.votes || [];
    this.eliminateAllVote = partialDay?.eliminateAllVote;
    this.voteResult = partialDay?.voteResult || VoteResult.NO_CANDIDATES;
  }

  serialize(exclude?: (keyof IRound)[]): IRound {
    /* eslint-disable no-param-reassign */
    const serializedRound = Object.entries(this)
      .reduce((round, [key, value]) => {
        const roundKey = key as keyof IRound;

        if (exclude?.includes(roundKey) || typeof value === 'undefined') return round;

        (round[roundKey] as any) = value;

        return round;
      }, {} as IRound);
    /* eslint-enable */

    return serializedRound;
  }
}
