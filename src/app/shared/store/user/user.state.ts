import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import {
  State,
  StateContext,
  Action,
  Selector,
  NgxsOnInit,
} from '@ngxs/store';
import { filter, map, switchMap } from 'rxjs/operators';

import { CollectionName } from '@/shared/models/collection-name.enum';
import { User } from '@/shared/models/user.model';

import { SetUser } from './user.actions';

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
    private firestore: AngularFirestore,
  ) {}

  ngxsOnInit(context: StateContext<UserStateModel>) {
    this.watchAndUpdateUserData(context);
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
      switchMap(({ uid }) => {
        const userDocs = this.firestore.collection<User>(
          CollectionName.USERS,
          (ref) => ref.where('uid', '==', uid),
        );

        return userDocs.valueChanges();
      }),
      map(([userData]) => userData),
    ).subscribe((user) => context.setState(user));
  }
}
