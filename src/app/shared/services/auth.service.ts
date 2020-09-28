import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';

import { User } from '@/shared/models/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private store: Store,
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
  ) { }

  async register(email: string, password: string, nickname: string) {
    const { user: { uid } } = await this.auth.createUserWithEmailAndPassword(email, password);
    const newUser: User = {
      uid,
      nickname,
    };

    await this.firestore.collection<User>('users').add(newUser);

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
