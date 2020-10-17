import { InvitationStatus } from '~types/enums/invitation-status.enum';

export interface IFireStoreJoinRequest {
  clubId: string;
  playerId: string;
  status: InvitationStatus;
}
