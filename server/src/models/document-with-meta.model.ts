import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DocumentMeta {
  @Field(() => ID)
  createdBy: string;
  @Field(() => ID)
  updatedBy: string;
  @Field(() => GraphQLISODateTime)
  createdAt: string;
  @Field(() => GraphQLISODateTime)
  updatedAt: string;
}
