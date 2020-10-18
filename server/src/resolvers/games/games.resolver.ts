import { FirebaseFirestoreService } from '@aginix/nestjs-firebase-admin';
import { UseGuards } from '@nestjs/common';
import { Resolver, Mutation, ID, Args, Context, Query } from '@nestjs/graphql';
import { ApolloError } from 'apollo-server-express';
import * as fbAdmin from 'firebase-admin';

import { AuthGuard } from '@/guards/auth.guard';
import { ClubsCollection, GamesCollection } from '@/models/collections.types';

import { GameInput, GamesInputName } from './games.input';
import { GameOutput } from './games.output';

import { CollectionName } from '~types/enums/colletion-name.enum';
import { ClubErrorCode, ClubAdminErrorCode } from '~types/enums/error-code.enum';
import { GameResult } from '~types/enums/game-result.enum';
import { Role } from '~types/enums/role.enum';

@Resolver()
@UseGuards(AuthGuard)
export class GamesResolver {
  private gamesCollection = this.firestore.collection(CollectionName.GAMES) as GamesCollection;
  private clubsCollection = this.firestore.collection(CollectionName.CLUBS) as ClubsCollection;

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

      if (!clubData.members.includes(currentUser.uid)) {
        throw new ApolloError('Only club member can add games for a club', ClubAdminErrorCode.NOT_ENOUGH_PERMISSIONS);
      }
    }

    const { id } = await this.gamesCollection.add(gameInput);

    return id;
  }

  @Query(() => [GameOutput], { name: 'lastGamesByUserId' })
  async getLastGamesByUserId(
    @Args('userId') userId: string,
  ): Promise<GameOutput[]> {
    // TODO: add hosted games
    const gamesDocs = await this.gamesCollection
      .where('members', 'array-contains', userId)
      .limit(25)
      .get();
    const gamesData = gamesDocs.docs
      .map((gameDoc) => {
        const gameData = gameDoc.data();
        const userRole = gameData.roles[userId];
        const isUserMafia = userRole === Role.MAFIA || userRole === Role.DON;
        const isUserCivilian = userRole === Role.CITIZEN || userRole === Role.SHERIFF;
        const isUserWonAsMafia = isUserMafia && gameData.result === GameResult.MAFIA;
        const isUserWonAsCivilian = isUserCivilian && gameData.result === GameResult.CIVILIANS;
        const won = isUserWonAsMafia || isUserWonAsCivilian;

        return {
          ...gameData,
          id: gameDoc.id,
          won,
        };
      });

    return gamesData;
  }
}
