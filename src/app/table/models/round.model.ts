import { Day } from './day.interface';
import { Night } from './night.interface';
import { VoteResult } from './vote-result.enum';
import { Vote } from './vote.interface';

export interface IRound extends Night, Day, Vote {
  kickedPlayers: string[];
}

export class Round implements IRound {
  kickedPlayers: string[];
  // Night
  shots: Record<string, string>; // <mafiaId, playerId>
  murderedPlayer?: string; // murdered player id
  donCheck?: string; // id of player checked by Don
  sheriffCheck?: string; // id of player checked by Sheriff

  // Day
  timers: Record<string, number>; // <playerId, timeLeft>
  proposedPlayers?: Record<string, string>; // <candidateId, playerId>

  // Vote
  isVoteDisabled = false;
  votes: Record<string, string[]>[]; // <candidatePlayerId, votePlayerId[]>, multiple votes can occur on ties
  eliminateAllVote?: Record<string, boolean>;
  voteResult?: VoteResult;

  constructor(partialRound?: Partial<Round>) {
    this.kickedPlayers = partialRound?.kickedPlayers || [];

    this.shots = partialRound?.shots || {};
    this.murderedPlayer = partialRound?.murderedPlayer;
    this.donCheck = partialRound?.donCheck;
    this.sheriffCheck = partialRound?.sheriffCheck;

    this.timers = partialRound?.timers || {};
    this.proposedPlayers = partialRound?.proposedPlayers;

    this.isVoteDisabled = partialRound?.isVoteDisabled || false;
    this.votes = partialRound?.votes || [];
    this.eliminateAllVote = partialRound?.eliminateAllVote;
    this.voteResult = partialRound?.voteResult;
  }
}
