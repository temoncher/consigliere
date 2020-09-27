import { User } from '@/shared/models/user.model';

export const userActionsPrefix = 'User';

export class SetUser {
  static readonly type = `[${userActionsPrefix}] Set user`;
  constructor(public user: User) { }
}
