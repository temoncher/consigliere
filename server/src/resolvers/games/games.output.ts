
import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

import { IDocumentMeta } from '@/interfaces/document-meta.interface';
import { IGame } from '@/interfaces/game.interface';
import { IPlayer } from '@/interfaces/player.interface';
import { IRound } from '@/interfaces/round.interface';
import { DocumentMeta } from '@/models/document-with-meta.model';
import { GameResult } from '~types/enums/game-result.enum';
import { Role } from '~types/enums/role.enum';
import { VoteResult } from '~types/enums/vote-result.enum';
import { IQuitPhase } from '~types/interfaces/quit-phase.interface';


@ObjectType()
export class PlayerOutput implements IPlayer {
  @Field(() => ID)
  uid: string;
  @Field()
  nickname: string;
  @Field(() => Int, { nullable: true })
  number?: number;
  @Field()
  isGuest: boolean;
}

@ObjectType()
export class RoundOutput implements IRound {
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

@ObjectType()
export class GameOutput extends DocumentMeta implements IGame, IDocumentMeta {
  @Field(() => ID)
  id: string;
  @Field(() => [ID])
  participants: string[];
  @Field(() => ID)
  creatorId: string;
  @Field(() => [RoundOutput])
  rounds: IRound[];
  @Field(() => GameResult)
  result: GameResult;
  @Field(() => [PlayerOutput])
  players: IPlayer[];
  @Field(() => GraphQLJSONObject)
  roles: Record<string, Role>;
  @Field(() => PlayerOutput)
  host: IPlayer;
  @Field(() => GraphQLJSONObject, { nullable: true })
  falls?: Record<string, number>;
  @Field(() => GraphQLJSONObject)
  quitPhases: Record<string, IQuitPhase>;
  @Field(() => GraphQLJSONObject, { nullable: true })
  speechSkips?: Record<string, number>;
}
