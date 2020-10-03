import { registerEnumType } from '@nestjs/graphql';

export enum VoteResult {
  NO_CANDIDATES = 'NO_CANDIDATES',
  SINGLE_CANDIDATE_AND_ZERO_DAY = 'SINGLE_CANDIDATE_AND_ZERO_DAY',
  VOTE_IS_DISABLED = 'VOTE_IS_DISABLED',
  PLAYERS_ELIMINATED = 'PLAYERS_ELIMINATED',
  PLAYERS_KEPT_ALIVE = 'PLAYERS_KEPT_ALIVE'
}

registerEnumType(VoteResult, {
  name: 'VoteResult',
});
