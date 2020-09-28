import { User } from '@/shared/models/user.interface';

export const userActionsPrefix = 'User';

export class SetUser {
  static readonly type = `[${userActionsPrefix}] Set user`;
  constructor(public user: User) { }
}

export class FetchUser {
  static readonly type = `[${userActionsPrefix}] Fetch user`;
  constructor() { }
}
