import { VoteResult } from './vote-result.enum';

export interface Vote {
  isVoteDisabled: boolean;
  votes: Record<string, string[]>[]; // <candidatePlayerId, votePlayerId[]>, multiple votes can occur on ties
  eliminateAllVote?: Map<string, boolean>;
  voteResult?: VoteResult;
}
