import { Field, ID, ObjectType } from '@nestjs/graphql';

import { DocumentMeta } from './document-with-meta.model';

@ObjectType()
export class User extends DocumentMeta {
  @Field(() => ID)
  uid: string;

  @Field()
  nickname: string;

  @Field({ nullable: true })
  avatar?: string;
}
