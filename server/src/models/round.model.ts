import { Field, ID, ObjectType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

import { VoteResult } from '@/enums/vote-result.enum';

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

@ObjectType()
export class Round implements IRound {
  @Field(() => [ID], {
    nullable: true,
    description: 'Kicked player id',
  })
  kickedPlayers?: string[];

  // Night
  @Field(() => GraphQLJSONObject, {
    nullable: true,
    description: 'Mafia shots, Record<string, string>; // { [mafiaId]: playerId }',
  })
  shots?: Record<string, string>;
  @Field(() => ID, { nullable: true })
  murderedPlayer?: string; // murdered player id
  @Field(() => ID, { nullable: true })
  donCheck?: string; // id of player checked by Don
  @Field(() => ID, { nullable: true })
  sheriffCheck?: string; // id of player checked by Sheriff

  // Day
  @Field(() => GraphQLJSONObject, {
    nullable: true,
    description: 'Players\' timers, Record<string, number>; // { [playerId]: timeElapsed }',
  })
  timers?: Record<string, number>;
  @Field(() => GraphQLJSONObject, {
    nullable: true,
    description: 'Proposed players, Record<string, string>; // { [candidateId]: playerId }',
  })
  proposedPlayers?: Record<string, string>;

  // Vote
  @Field({ nullable: true })
  isVoteDisabled?: boolean;
  @Field(() => GraphQLJSONObject, {
    nullable: true,
    description: 'Votes, Record<string, string[]>; // { [candidatePlayerId]: votePlayerId[] }',
  })
  votes?: Record<string, string[]>[]; // multiple votes can occur on ties
  @Field(() => GraphQLJSONObject, {
    nullable: true,
    description: 'Votes, Record<string, boolean>; // { [playerId]: isAgreed }',
  })
  eliminateAllVote?: Record<string, boolean>;
  @Field(() => VoteResult)
  voteResult: VoteResult;
}
