import { Field, ArgsType, Int, ID, InputType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

import { IGame } from '@/interfaces/game.interface';
import { IPlayer } from '@/interfaces/player.interface';
import { IRound } from '@/interfaces/round.interface';
import { DocumentMeta } from '@/models/document-with-meta.model';
import { GameResult } from '~types/enums/game-result.enum';
import { Role } from '~types/enums/role.enum';
import { VoteResult } from '~types/enums/vote-result.enum';
import { IQuitPhase } from '~types/interfaces/quit-phase.interface';

@ArgsType()
export class GetGameArgs {
  @Field(() => String, { nullable: true })
  id?: string;
}

@ArgsType()
export class GetLastGamesArgs {
  @Field(() => String)
  playerId: string;

  @Field(() => Int, { nullable: true })
  limit?: number;
}

@InputType()
export class RoundInput implements IRound {
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
  @Field(() => ID, {
    nullable: true,
    description: 'murdered player id',
  })
  murderedPlayer?: string;
  @Field(() => ID, {
    nullable: true,
    description: 'id of player checked by Don',
  })
  donCheck?: string;
  @Field(() => ID, {
    nullable: true,
    description: 'id of player checked by Sheriff',
  })
  sheriffCheck?: string;

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

@InputType()
export class PlayerInput implements IPlayer {
  @Field(() => ID)
  uid: string;
  @Field()
  nickname: string;
  @Field(() => Int, { nullable: true })
  number?: number;
  @Field()
  isGuest: boolean;
}

@InputType()
export class GameInput extends DocumentMeta implements Partial<IGame> {
  @Field(() => [RoundInput])
  rounds: IRound[];
  @Field(() => GameResult)
  result: GameResult;
  @Field(() => [PlayerInput])
  players: PlayerInput[];
  @Field(() => GraphQLJSONObject)
  roles: Record<string, Role>;
  @Field(() => PlayerInput)
  host: PlayerInput;
  @Field(() => GraphQLJSONObject, { nullable: true })
  falls?: Record<string, number>;
  @Field(() => GraphQLJSONObject)
  quitPhases: Record<string, IQuitPhase>;
  @Field(() => GraphQLJSONObject, { nullable: true })
  speechSkips?: Record<string, number>;
}
