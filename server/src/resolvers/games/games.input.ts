import { Field, ArgsType, Int, ID, InputType } from '@nestjs/graphql';
import * as fbAdmin from 'firebase-admin';
import { GraphQLJSONObject } from 'graphql-type-json';

import { IFireStoreGame } from '@/interfaces/game.interface';
import { IFireStorePlayer } from '@/interfaces/player.interface';
import { IFireStoreRound } from '@/interfaces/round.interface';
import { DocumentMeta } from '@/models/document-with-meta.model';
import { FirebaseTimestampScalar } from '@/scalars/firebase-timestamp.scalar';

import { GameResult } from '~types/enums/game-result.enum';
import { Role } from '~types/enums/role.enum';
import { VoteResult } from '~types/enums/vote-result.enum';
import { IQuitPhase } from '~types/interfaces/quit-phase.interface';

export enum GamesInputName {
  GAME = 'game'
}

@ArgsType()
export class GetGameArgs {
  @Field(() => String, { nullable: true })
  id?: string;
}

@ArgsType()
export class GetLastGamesByPlayerIdArgs {
  @Field(() => String)
  playerId: string;

  @Field(() => Int, { nullable: true })
  limit?: number;
}

@InputType()
export class RoundInput implements IFireStoreRound {
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
export class PlayerInput implements IFireStorePlayer {
  @Field(() => ID)
  uid: string;
  @Field()
  nickname: string;
  @Field(() => Int, { nullable: true })
  number?: number;
  @Field()
  isGuest: boolean;
}

@InputType(GamesInputName.GAME)
export class GameInput extends DocumentMeta implements Partial<IFireStoreGame> {
  @Field(() => String, { nullable: true })
  club?: string;

  @Field(() => Int)
  gameNumber: number;
  @Field(() => FirebaseTimestampScalar)
  date: fbAdmin.firestore.Timestamp;
  @Field(() => PlayerInput)
  host: IFireStorePlayer;
  @Field(() => [String])
  triple: [string, string, string];
  @Field(() => GameResult)
  result: GameResult;
  @Field(() => [PlayerInput])
  players: IFireStorePlayer[];
  @Field(() => GraphQLJSONObject)
  falls: Record<string, number>;
  @Field(() => GraphQLJSONObject)
  quitPhases: Record<string, IQuitPhase>;
  /** <candidatePlayerId, votesNumber[]> */
  @Field(() => GraphQLJSONObject)
  votes: Record<string, number[]>[];
  @Field(() => GraphQLJSONObject)
  roles: Record<string, Role>;
  @Field(() => [String])
  donChecks: string[];
  @Field(() => [String])
  sheriffChecks: string[];
}
