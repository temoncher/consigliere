import { ArgsType, Field, InputType } from '@nestjs/graphql';

import { IClub } from '@/interfaces/club.interface';

export enum ClubsInputs {
  NEW_CLUB = 'club'
}

@ArgsType()
export class GetClubArgs {
  @Field()
  id: string;
}

@InputType(ClubsInputs.NEW_CLUB)
export class NewClubInput implements Partial<IClub> {
  @Field()
  title: string;
}
