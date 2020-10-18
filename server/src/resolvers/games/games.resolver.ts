import { FirebaseFirestoreService } from '@aginix/nestjs-firebase-admin';
import { UseGuards } from '@nestjs/common';
import { Resolver, Mutation, ID, Args, Context, Query } from '@nestjs/graphql';
import { ApolloError } from 'apollo-server-express';
import * as fbAdmin from 'firebase-admin';

import { AuthGuard } from '@/guards/auth.guard';
import { IFireStoreDocumentMeta } from '@/interfaces/document-meta.interface';
import { IFireStoreGame } from '@/interfaces/game.interface';
import { ClubsCollection, GamesCollection } from '@/models/collections.types';
import { AlgoliaService } from '@/services/algolia.service';

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

  constructor(
    private firestore: FirebaseFirestoreService,
    private algoliaService: AlgoliaService,
  ) {}

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

    const meta: IFireStoreDocumentMeta = {
      createdAt: fbAdmin.firestore.Timestamp.now(),
      createdBy: currentUser.uid,
      updatedAt: fbAdmin.firestore.Timestamp.now(),
      updatedBy: currentUser.uid,
    };
    const newGame = {
      ...gameInput,
      ...meta,
    };

    const { id } = await this.gamesCollection.add(newGame);

    return id;
  }

  @Query(() => [GameOutput], { name: 'lastGamesByUserId' })
  async getLastGamesByUserId(
    @Args('userId') userId: string,
  ): Promise<GameOutput[]> {
    const { hits } = await this.algoliaService.gamesByParticipantIndex
      .search<IFireStoreGame & IFireStoreDocumentMeta & { objectID: string }>(
      userId,
      { hitsPerPage: 25 },
    );
    const games = hits.map(({ objectID, ...hit }) => ({ ...hit, id: objectID }));
    const gamesData = games
      .map((game) => {
        if (game.host.uid === userId) {
          return {
            ...game,
            won: undefined,
          };
        }

        const userRole = game.roles[userId];
        const isUserMafia = userRole === Role.MAFIA || userRole === Role.DON;
        const isUserCivilian = userRole === Role.CITIZEN || userRole === Role.SHERIFF;
        const isUserWonAsMafia = isUserMafia && game.result === GameResult.MAFIA;
        const isUserWonAsCivilian = isUserCivilian && game.result === GameResult.CIVILIANS;
        const won = isUserWonAsMafia || isUserWonAsCivilian;

        return {
          ...game,
          won,
        };
      });

    return gamesData;
  }
}
