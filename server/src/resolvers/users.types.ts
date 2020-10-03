import { Field, ArgsType } from '@nestjs/graphql';

@ArgsType()
export class GetUserArgs {
  @Field(() => String, { nullable: true })
  id?: string;

  @Field(() => String, { nullable: true })
  nickname?: string;
}

@ArgsType()
export class GetUsersArgs {
  @Field(() => [String], { nullable: true })
  ids?: string[];

  @Field(() => [String], { nullable: true })
  nicknames?: string[];
}
