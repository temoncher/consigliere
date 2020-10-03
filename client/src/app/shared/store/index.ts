import { ExtendedTableStateModel, GameStates } from '@/table/store';

import { UserState, UserStateModel } from './user/user.state';

export interface ApplicationStateModel {
  table: ExtendedTableStateModel;
  user: UserStateModel;
}

export const ApplicationStates = [
  ...GameStates,
  UserState,
];
