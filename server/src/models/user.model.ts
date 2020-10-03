import { Field, ID, ObjectType } from '@nestjs/graphql';

import { DateDocument } from './date-document.model';

@ObjectType()
export class User extends DateDocument {
  @Field(() => ID)
  uid: string;

  @Field()
  nickname: string;

  @Field()
  avatar?: string;
}
