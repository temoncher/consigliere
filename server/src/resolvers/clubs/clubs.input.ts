import { ArgsType, Field, InputType } from '@nestjs/graphql';

import { IClub } from '@/interfaces/club.interface';

export enum ClubsInputName {
  NEW_CLUB = 'club'
}

@ArgsType()
export class GetClubArgs {
  @Field()
  id: string;
}

@ArgsType()
export class ResignArgs {
  @Field()
  clubId: string;
  @Field()
  successorId: string;
}

@ArgsType()
export class SearchClubArgs {
  @Field()
  query: string;
  @Field({ nullable: true })
  limit?: number;
}

@InputType(ClubsInputName.NEW_CLUB)
export class NewClubInput implements Partial<IClub> {
  @Field()
  title: string;
  @Field({ nullable: true })
  location?: string;
}
