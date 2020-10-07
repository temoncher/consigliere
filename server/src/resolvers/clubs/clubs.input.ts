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

@InputType(ClubsInputName.NEW_CLUB)
export class NewClubInput implements Partial<IClub> {
  @Field()
  title: string;
  @Field({ nullable: true })
  location?: string;
}
