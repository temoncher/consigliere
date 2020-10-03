import { Field, ArgsType, Int } from '@nestjs/graphql';

@ArgsType()
export class GetGameArgs {
  @Field(() => String, { nullable: true })
  id?: string;
}

@ArgsType()
export class GetLastGamesArgs {
  @Field(() => String)
  playerId: string;

  @Field(() => Int, { nullable: true })
  limit?: number;
}
