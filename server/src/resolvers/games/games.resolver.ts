import { FirebaseFirestoreService } from '@aginix/nestjs-firebase-admin';
import { UseGuards } from '@nestjs/common';
import { Resolver } from '@nestjs/graphql';

import { AuthGuard } from '@/guards/auth.guard';
import { ClubsCollection, GamesCollection } from '@/models/collections.types';

import { CollectionName } from '~types/enums/colletion-name.enum';

@Resolver()
@UseGuards(AuthGuard)
export class GamesResolver {
  private gamesCollection = this.firestore.collection(CollectionName.GAMES) as GamesCollection;
  private clubsCollection = this.firestore.collection(CollectionName.USERS) as ClubsCollection;

  constructor(private firestore: FirebaseFirestoreService) {}
}
