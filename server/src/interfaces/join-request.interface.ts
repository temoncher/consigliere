import { InvitationStatus } from '~types/enums/invitation-status.enum';

export interface IJoinRequest {
  clubId: string;
  playerId: string;
  status: InvitationStatus;
}
