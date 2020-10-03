import { AngularFirestore } from '@angular/fire/firestore';

import { CollectionName } from '@/shared/models/collection-name.enum';
import { IGame } from '@/shared/models/game.interface';

import { IApi } from './api.interface';

export class GamesApi implements IApi<IGame> {
  private gamesCollection = this.firestore.collection<IGame>(CollectionName.GAMES);

  constructor(private firestore: AngularFirestore) {}

  async create(game: Omit<IGame, 'createdAt' | 'updatedAt'>): Promise<void> {
    await this.gamesCollection.add(game);
  }
}
