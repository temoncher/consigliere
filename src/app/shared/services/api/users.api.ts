import { AngularFirestore } from '@angular/fire/firestore';

import { CollectionName } from '@/shared/models/collection-name.enum';
import { User } from '@/shared/models/user.interface';

import { Api } from './api.interface';

export class UsersApi implements Api<User> {
  private usersCollection = this.firestore.collection<User>(CollectionName.USERS);

  constructor(private firestore: AngularFirestore) {}

  async create(user: User) {
    await this.usersCollection.doc(user.uid).set(user);
  }

  getOne(id: string) {
    return this.usersCollection.doc<User>(id).valueChanges();
  }

  async getOneSnapshot(id: string): Promise<User> {
    const userDocument = await this.usersCollection.doc<User>(id).get().toPromise();

    return userDocument.data() as User;
  }
}
