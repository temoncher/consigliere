import { AngularFirestore } from '@angular/fire/firestore';

import { CollectionName } from '@/shared/models/collection-name.enum';
import { IGame } from '@/shared/models/game.interface';

import { IApi } from './api.interface';

export class GamesApi implements IApi<IGame> {
  private gamesCollection = this.firestore.collection<IGame>(CollectionName.GAMES);

  constructor(private firestore: AngularFirestore) {}

  async create(game: IGame): Promise<void> {
    await this.gamesCollection.add(game);
  }

  async getLastGamesByPlayerID(id: string) {
    // const createdGamesDocs = await this.gamesCollection.ref.where('creatorId', '==', id).get();
    // const hostedGamesDocs = await this.gamesCollection.ref.where('host.user', '==', id).get();
    // const hostedGamesDocs = await this.gamesCollection.ref.where('host.user', '==', id).get();
  }
}
