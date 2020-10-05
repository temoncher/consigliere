import { ObjectType, Field, ID } from '@nestjs/graphql';

import { IClub } from '@/interfaces/club.interface';

@ObjectType()
export class ClubOutput implements IClub {
  @Field(() => ID)
  id: string;
  @Field(() => ID)
  admin: string;
  @Field({ nullable: true })
  avatar?: string;
  @Field()
  title: string;
  @Field(() => [ID])
  confidants: string[];
  @Field(() => [ID])
  members: string[];
}
