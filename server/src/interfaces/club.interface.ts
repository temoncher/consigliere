export interface IFireStoreClub {
  title: string;
  location?: string;
  avatar?: string;
  admin: string;
  confidants: string[];
  members: string[];
  public: boolean;
}
