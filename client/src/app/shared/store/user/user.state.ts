import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  State,
  StateContext,
  Action,
  Selector,
  NgxsOnInit,
} from '@ngxs/store';
import { filter, switchMap, tap } from 'rxjs/operators';

import { IUser } from '@/shared/models/user.interface';
import { UsersApi } from '@/shared/services/api/users.api';
import { LoggerService } from '@/table/services/logger.service';

import { SetUser } from './user.actions';

export type UserStateModel = IUser | null;

@State<UserStateModel>({
  name: 'user',
  defaults: null,
})
@Injectable()
export class UserState implements NgxsOnInit {
  @Selector()
  static getState(state: UserStateModel) {
    return state;
  }

  constructor(
    private fireauth: AngularFireAuth,
    private usersApi: UsersApi,
    private logger: LoggerService,
  ) {}

  ngxsOnInit(context: StateContext<UserStateModel>) {
    this.watchAndUpdateUserData(context);
  }

  @Action(SetUser)
  setUser(
    { setState }: StateContext<UserStateModel>,
    { user }: SetUser,
  ) {
    this.logger.log('New user data is:', user);
    setState(user);
  }

  private watchAndUpdateUserData(context: StateContext<UserStateModel>) {
    this.fireauth.user.pipe(
      filter((user) => !!user),
      tap((user) => {
        this.logUser(user);
      }),
      switchMap(({ uid }) => this.usersApi.getOne(uid)),
    ).subscribe((user) => {
      context.setState(user);
    });
  }

  private async logUser(user: firebase.User) {
    const token = await user.getIdToken();

    this.logger.log('New token is:', { token });
  }
}
