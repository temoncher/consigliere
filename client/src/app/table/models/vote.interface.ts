import { VoteResult } from '~types/enums/vote-result.enum';

export interface IVote {
  isVoteDisabled?: boolean;
  votes?: Record<string, string[]>[]; // <candidatePlayerId, votePlayerId[]>, multiple votes can occur on ties
  eliminateAllVote?: Record<string, boolean>;
  voteResult?: VoteResult;
}
