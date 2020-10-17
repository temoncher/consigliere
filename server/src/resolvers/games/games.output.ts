
import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import * as fbAdmin from 'firebase-admin';
import { GraphQLJSONObject } from 'graphql-type-json';

import { IFireStoreDocumentMeta } from '@/interfaces/document-meta.interface';
import { IFireStoreGame } from '@/interfaces/game.interface';
import { IFireStorePlayer } from '@/interfaces/player.interface';
import { DocumentMeta } from '@/models/document-with-meta.model';
import { FirebaseTimestampScalar } from '@/scalars/firebase-timestamp.scalar';

import { GameResult } from '~types/enums/game-result.enum';
import { Role } from '~types/enums/role.enum';
import { IQuitPhase } from '~types/interfaces/quit-phase.interface';

@ObjectType()
export class PlayerOutput implements IFireStorePlayer {
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
export class GameOutput extends DocumentMeta implements IFireStoreGame, IFireStoreDocumentMeta {
  @Field(() => ID)
  id: string;
  @Field(() => ID, { nullable: true })
  club?: string;
  @Field()
  detailed: boolean;
  @Field()
  gameNumber: number;
  @Field(() => FirebaseTimestampScalar)
  date: fbAdmin.firestore.Timestamp;
  @Field(() => PlayerOutput)
  host: IFireStorePlayer;
  @Field(() => [String])
  triple: [string, string, string];
  @Field(() => GameResult)
  result: GameResult;
  @Field(() => [PlayerOutput])
  players: IFireStorePlayer[];
  @Field(() => GraphQLJSONObject, { nullable: true })
  falls: Record<string, number>;
  @Field(() => GraphQLJSONObject)
  quitPhases: Record<string, IQuitPhase>;
  @Field(() => [GraphQLJSONObject], {
    nullable: true,
    description: 'Record<string, number[]>[]; <candidatePlayerId, votesNumber>[]',
  })
  votes: Record<string, number[]>[];
  @Field(() => GraphQLJSONObject)
  roles: Record<string, Role>;
  @Field(() => [String], { nullable: true })
  donChecks: string[];
  @Field(() => [String], { nullable: true })
  sheriffChecks: string[];
}
