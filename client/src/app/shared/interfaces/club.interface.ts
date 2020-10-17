import { ClubRole } from '~types/enums/club-role.enum';

export interface IFireStoreClub {
  title: string;
  location?: string;
  avatar?: string;
  admin: string;
  confidants: string[];
  members: string[];
  public: boolean;
}

export interface IClub extends IFireStoreClub {
  role: ClubRole;
  id: string;
}
