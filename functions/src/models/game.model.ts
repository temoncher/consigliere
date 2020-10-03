import { Field, ID, ObjectType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

import { GameResult } from '@/enums/game-result.enum';
import { Role } from '@/enums/role.enum';
import { IQuitPhase } from '@/interfaces/quit-phase.interface';

import { DateDocument } from './date-document.model';
import { Player } from './player.model';
import { Round } from './round.model';

@ObjectType()
export class Game extends DateDocument {
  @Field(() => ID)
  id?: string;
  @Field(() => [ID])
  participants: string[];
  @Field(() => ID)
  creatorId: string;
  @Field(() => [Round])
  rounds: Round[];
  @Field()
  result: GameResult;
  @Field(() => [Player])
  players: Player[];
  @Field(() => GraphQLJSONObject)
  roles: Record<string, Role>;
  @Field(() => Player)
  host: Player;
  @Field(() => GraphQLJSONObject, { nullable: true })
  falls?: Record<string, number>;
  @Field(() => GraphQLJSONObject)
  quitPhases: Record<string, IQuitPhase>;
  @Field(() => GraphQLJSONObject, { nullable: true })
  speechSkips?: Record<string, number>;
}
