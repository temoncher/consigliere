import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  State,
  StateContext,
  Action,
  Selector,
  NgxsOnInit,
} from '@ngxs/store';
import { filter, switchMap } from 'rxjs/operators';

import { User } from '@/shared/models/user.interface';
import { ApiService } from '@/shared/services/api/api.service';

import { FetchUser, SetUser } from './user.actions';

export type UserStateModel = User | null;

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
    private auth: AngularFireAuth,
    private apiService: ApiService,
  ) {}

  ngxsOnInit(context: StateContext<UserStateModel>) {
    this.watchAndUpdateUserData(context);
  }

  @Action(FetchUser)
  async fetchUser({ setState }: StateContext<UserStateModel>) {
    const currentUser = await this.auth.currentUser;

    const user = await this.apiService.users.getOneSnapshot(currentUser.uid);

    setState(user);
  }

  @Action(SetUser)
  setUser(
    { setState }: StateContext<UserStateModel>,
    { user }: SetUser,
  ) {
    setState(user);
  }

  private watchAndUpdateUserData(context: StateContext<UserStateModel>) {
    this.auth.user.pipe(
      filter((user) => !!user),
      switchMap(({ uid }) => this.apiService.users.getOne(uid)),
    ).subscribe((user) => context.setState(user));
  }
}
