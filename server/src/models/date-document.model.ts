import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DateDocument {
  @Field(() => GraphQLISODateTime)
  createdAt: string;
  @Field(() => GraphQLISODateTime)
  updatedAt: string;
}
