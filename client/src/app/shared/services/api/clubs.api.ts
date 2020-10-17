import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, switchMap, filter } from 'rxjs/operators';

import { extractDocData } from '@/shared/helpers/extract-doc-data';
import { IFireStoreClub, IClub } from '@/shared/interfaces/club.interface';

import { ClubRole } from '~types/enums/club-role.enum';
import { CollectionName } from '~types/enums/colletion-name.enum';

const addRole = (club: Omit<IClub, 'role'>, userId: string): IClub => {
  let role = ClubRole.MEMBER;

  if (club.confidants.includes(userId)) {
    role = ClubRole.CONFIDANT;
  }

  if (club.admin === userId) {
    role = ClubRole.ADMIN;
  }

  const populatedClub: IClub = {
    ...club,
    role,
  };

  return populatedClub;
};

@Injectable({ providedIn: 'root' })
export class ClubsApi {
  userClubs$: Observable<IClub[]> = this.fireauth.user.pipe(
    filter((fireUser) => !!fireUser),
    map((fireUser) => fireUser.uid),
    switchMap((userId) => this.firestore.collection<IFireStoreClub>(
      CollectionName.CLUBS,
      (ref) => ref.where('members', 'array-contains', userId),
    ).snapshotChanges().pipe(
      // extract club data and add `clubId` to it
      map((clubs) => extractDocData(clubs)),
      // add user's role
      map((clubs) => clubs.map((club) => addRole(club, userId))),
    )),
  );

  constructor(
    private firestore: AngularFirestore,
    private fireauth: AngularFireAuth,
  ) {}
}
