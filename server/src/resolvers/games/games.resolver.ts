import { FirebaseFirestoreService } from '@aginix/nestjs-firebase-admin';
import { UseGuards } from '@nestjs/common';
import { Resolver, Mutation, ID, Args, Context } from '@nestjs/graphql';
import { ApolloError } from 'apollo-server-express';
import * as fbAdmin from 'firebase-admin';

import { AuthGuard } from '@/guards/auth.guard';
import { ClubsCollection, GamesCollection } from '@/models/collections.types';

import { GameInput, GamesInputName } from './games.input';

import { CollectionName } from '~types/enums/colletion-name.enum';
import { ClubErrorCode, ClubAdminErrorCode } from '~types/enums/error-code.enum';

@Resolver()
@UseGuards(AuthGuard)
export class GamesResolver {
  private gamesCollection = this.firestore.collection(CollectionName.GAMES) as GamesCollection;
  private clubsCollection = this.firestore.collection(CollectionName.USERS) as ClubsCollection;

  constructor(private firestore: FirebaseFirestoreService) {}

  @Mutation(() => ID)
  async createGame(
    @Context('user') currentUser: fbAdmin.auth.UserRecord,
      @Args(GamesInputName.GAME) gameInput: GameInput,
  ): Promise<string> {
    if (gameInput.club) {
      const clubDoc = await this.clubsCollection.doc(gameInput.club).get();
      const clubData = clubDoc.data();

      if (!clubData) {
        throw new ApolloError('Club not found', ClubErrorCode.NOT_FOUND);
      }

      if (clubData.members.includes(currentUser.uid)) {
        throw new ApolloError('Only club member can add games for a club', ClubAdminErrorCode.NOT_ENOUGH_PERMISSIONS);
      }
    }

    const { id } = await this.gamesCollection.add(gameInput);

    return id;
  }
}
