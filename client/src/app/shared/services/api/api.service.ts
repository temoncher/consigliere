import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { GamesApi } from './games.api';
import { UsersApi } from './users.api';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  games: GamesApi;
  users: UsersApi;

  constructor(private firestore: AngularFirestore) {
    this.games = new GamesApi(this.firestore);
    this.users = new UsersApi(this.firestore);
  }
}
