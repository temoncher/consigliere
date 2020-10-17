import { Field, ID, ObjectType } from '@nestjs/graphql';

import { IFireStoreJoinRequest } from '@/interfaces/join-request.interface';
import { DocumentMeta } from '@/models/document-with-meta.model';

import { InvitationStatus } from '~types/enums/invitation-status.enum';

@ObjectType()
export class JoinRequestOutput extends DocumentMeta implements IFireStoreJoinRequest {
  @Field(() => ID)
  id: string;
  @Field(() => ID)
  clubId: string;
  @Field(() => ID)
  playerId: string;
  @Field(() => InvitationStatus)
  status: InvitationStatus;
}
