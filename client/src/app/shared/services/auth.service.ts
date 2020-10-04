import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { filter, tap } from 'rxjs/operators';

import { IUser } from '@/shared/models/user.interface';
import { LoggerService } from '@/table/services/logger.service';

import { ApiService } from './api/api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser: firebase.User;

  constructor(
    private store: Store,
    private apiService: ApiService,
    private fireauth: AngularFireAuth,
    private logger: LoggerService,
  ) {
    this.watchAndUpdateUser();
  }

  async register(email: string, password: string, nickname: string) {
    const { user: { uid } } = await this.fireauth.createUserWithEmailAndPassword(email, password);
    const newUser: IUser = {
      uid,
      nickname,
    };

    await this.apiService.users.create(newUser);

    this.store.dispatch(new Navigate(['tabs', 'table']));
  }

  async login(email: string, password: string) {
    await this.fireauth.signInWithEmailAndPassword(email, password);
    const currentUser = await this.fireauth.currentUser;
    const token = await currentUser.getIdToken();

    this.logger.log('Logged in with user:', currentUser);
    this.logger.log('User\'s token:', token);

    this.store.dispatch(new Navigate(['tabs', 'table']));
  }

  async logout() {
    await this.fireauth.signOut();

    this.store.dispatch(new Navigate(['auth', 'login']));
  }

  private watchAndUpdateUser() {
    this.fireauth.user.pipe(
      filter((user) => !!user),
      tap((user) => this.logger.log('Detected user change:', user)),
    ).subscribe((user) => this.currentUser = user);
  }
}
