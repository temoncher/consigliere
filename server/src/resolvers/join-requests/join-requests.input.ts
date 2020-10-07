import { Field, ID, InputType } from '@nestjs/graphql';

import { InvitationStatus } from '~types/enums/invitation-status.enum';

export enum JoinRequestInputNames {
  NEW_JOIN_REQUEST = 'joinRequest'
}

@InputType(JoinRequestInputNames.NEW_JOIN_REQUEST)
export class JoinRequestInput {
  @Field(() => ID)
  clubId: string;
  @Field(() => [InvitationStatus], { nullable: true })
  statuses?: InvitationStatus[];
}
