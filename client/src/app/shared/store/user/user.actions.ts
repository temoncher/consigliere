import { IUser } from '@/shared/models/user.interface';

export const userActionsPrefix = 'User';

export class SetUser {
  static readonly type = `[${userActionsPrefix}] Set user`;
  constructor(public user: IUser) { }
}
