import { VoteResult } from '~types/enums/vote-result.enum';

export interface IFireStoreRound {
  // Day
  /** <playerId, timeLeft> */
  timers?: Record<string, number>;

  // Vote
  isVoteDisabled?: boolean;
  /** <candidatePlayerId, votePlayerId[]>, multiple votes can occur on ties */
  votes?: Record<string, string[]>[];
  eliminateAllVote?: Record<string, boolean>;
  voteResult: VoteResult;
}
