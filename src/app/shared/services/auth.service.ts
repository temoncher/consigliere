import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';

import { IUser } from '@/shared/models/user.interface';

import { ApiService } from './api/api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private store: Store,
    private apiService: ApiService,
    private auth: AngularFireAuth,
  ) { }

  async register(email: string, password: string, nickname: string) {
    const { user: { uid } } = await this.auth.createUserWithEmailAndPassword(email, password);
    const newUser: IUser = {
      uid,
      nickname,
    };

    await this.apiService.users.create(newUser);

    this.store.dispatch(new Navigate(['tabs', 'table']));
  }

  async login(email: string, password: string) {
    await this.auth.signInWithEmailAndPassword(email, password);

    this.store.dispatch(new Navigate(['tabs', 'table']));
  }

  async logout() {
    await this.auth.signOut();

    this.store.dispatch(new Navigate(['auth', 'login']));
  }
}
