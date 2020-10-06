import { VoteResult } from '~enums/vote-result.enum';

export interface IRound {
  kickedPlayers?: string[];
  // Night
  shots?: Record<string, string>; // <mafiaId, playerId>
  murderedPlayer?: string; // murdered player id
  donCheck?: string; // id of player checked by Don
  sheriffCheck?: string; // id of player checked by Sheriff

  // Day
  timers?: Record<string, number>; // <playerId, timeLeft>
  proposedPlayers?: Record<string, string>; // <candidateId, playerId>

  // Vote
  isVoteDisabled?: boolean;
  votes?: Record<string, string[]>[]; // <candidatePlayerId, votePlayerId[]>, multiple votes can occur on ties
  eliminateAllVote?: Record<string, boolean>;
  voteResult: VoteResult;
}
