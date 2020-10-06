export interface IClub {
  id: string;
  title: string;
  location?: string;
  avatar?: string;
  admin: string;
  confidants: string[];
  members: string[];
}
