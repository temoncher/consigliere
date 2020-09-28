import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { GamesApi } from './games.api';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  games: GamesApi;

  constructor(
    private firestore: AngularFirestore,
  ) {
    this.games = new GamesApi(this.firestore);
  }
}
