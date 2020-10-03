import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

export interface IPlayer {
  uid: string;
  nickname: string;
  number?: number;
  isGuest: boolean;
}

@ObjectType()
export class Player implements IPlayer {
  @Field(() => ID)
  uid: string;
  @Field()
  nickname: string;
  @Field(() => Int, { nullable: true })
  number?: number;
  @Field()
  isGuest: boolean;
}
