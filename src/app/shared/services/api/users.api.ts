import { AngularFirestore } from '@angular/fire/firestore';

import { CollectionName } from '@/shared/models/collection-name.enum';
import { IUser } from '@/shared/models/user.interface';

import { IApi } from './api.interface';

export class UsersApi implements IApi<IUser> {
  private usersCollection = this.firestore.collection<IUser>(CollectionName.USERS);

  constructor(private firestore: AngularFirestore) {}

  async create(user: IUser) {
    await this.usersCollection.doc(user.uid).set(user);
  }

  getOne(id: string) {
    return this.usersCollection.doc<IUser>(id).valueChanges();
  }

  async getOneSnapshot(id: string): Promise<IUser> {
    const userDocument = await this.usersCollection.doc<IUser>(id).get().toPromise();

    return userDocument.data() as IUser;
  }
}
