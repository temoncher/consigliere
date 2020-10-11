import { VoteResult } from '~types/enums/vote-result.enum';

export interface IRound {
  kickedPlayers?: string[];
  // Night
  /** <mafiaId, playerId> */
  shots?: Record<string, string>;
  /** murdered player id */
  murderedPlayer?: string;
  /** id of player checked by Don */
  donCheck?: string;
  /** id of player checked by Sheriff */
  sheriffCheck?: string;

  // Day
  /** <playerId, timeLeft> */
  timers?: Record<string, number>;
  /** <candidateId, playerId> */
  proposedPlayers?: Record<string, string>;

  // Vote
  isVoteDisabled?: boolean;
  /** <candidatePlayerId, votePlayerId[]>, multiple votes can occur on ties */
  votes?: Record<string, string[]>[];
  eliminateAllVote?: Record<string, boolean>;
  voteResult: VoteResult;
}
