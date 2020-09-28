import { AngularFirestore } from '@angular/fire/firestore';

import { CollectionName } from '@/shared/models/collection-name.enum';
import { Game } from '@/shared/models/game.interface';

import { Api } from './api.interface';

export class GamesApi implements Api<Game> {
  private gamesCollection = this.firestore.collection<Game>(CollectionName.GAMES);

  constructor(private firestore: AngularFirestore) {}

  async create(game: Game): Promise<void> {
    await this.gamesCollection.add(game);
  }
}
