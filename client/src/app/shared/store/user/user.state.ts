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
import { ApiService } from '@/shared/services/api/api.service';

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
    private apiService: ApiService,
  ) {}

  ngxsOnInit(context: StateContext<UserStateModel>) {
    this.watchAndUpdateUserData(context);
  }

  @Action(SetUser)
  setUser(
    { setState }: StateContext<UserStateModel>,
    { user }: SetUser,
  ) {
    console.log('New user data is:', user);
    setState(user);
  }

  private watchAndUpdateUserData(context: StateContext<UserStateModel>) {
    this.fireauth.user.pipe(
      filter((user) => !!user),
      tap((user) => {
        this.logUser(user);
      }),
      switchMap(({ uid }) => this.apiService.users.getOne(uid)),
    ).subscribe((user) => {
      context.setState(user);
    });
  }

  private async logUser(user: firebase.User) {
    const token = await user.getIdToken();

    console.log('New token is:', { token });
  }
}
