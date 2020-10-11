import { FirebaseFirestoreService } from '@aginix/nestjs-firebase-admin';
import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ApolloError, ForbiddenError } from 'apollo-server-express';
import * as admin from 'firebase-admin';

import { AuthGuard } from '@/guards/auth.guard';
import { IDocumentMeta } from '@/interfaces/document-meta.interface';
import { IGame } from '@/interfaces/game.interface';
import { ClubsCollection, GamesCollection } from '@/models/collections.types';

import { GameInput, GetGameArgs, GetLastGamesByPlayerIdArgs } from './games.input';
import { GameOutput, LastGamesByPlayerIdOutput } from './games.output';

import { CollectionName } from '~types/enums/colletion-name.enum';
import { ErrorCode, GameErrorCode } from '~types/enums/error-code.enum';
import { GameResult } from '~types/enums/game-result.enum';
import { Role } from '~types/enums/role.enum';

@Resolver()
@UseGuards(AuthGuard)
export class GamesResolver {
  private gamesCollection = this.firestore.collection(CollectionName.GAMES) as GamesCollection;
  private clubsCollection = this.firestore.collection(CollectionName.USERS) as ClubsCollection;

  constructor(private firestore: FirebaseFirestoreService) {}

  @Mutation(() => GameOutput)
  async addGame(
    @Args('addGameData') gameInput: GameInput,
      @Context('user') currentUser: admin.auth.UserRecord,
  ): Promise<GameOutput> {
    const playersIds = gameInput.players.map((player) => player.uid);

    if (gameInput.club) {
      const clubDoc = await this.clubsCollection.doc(gameInput.club).get();
      const clubData = clubDoc.data();
      const isAdmin = clubData.admin === currentUser.uid;
      const isConfidant = clubData.confidants.includes(currentUser.uid);

      if (!isAdmin && !isConfidant) {
        throw new ForbiddenError('You must be admin or confidant to add new games on behalf of club');
      }
    }

    const meta: IDocumentMeta = {
      createdAt: admin.firestore.Timestamp.now(),
      createdBy: currentUser.uid,
      updatedAt: admin.firestore.Timestamp.now(),
      updatedBy: currentUser.uid,
    };
    const newGameData: Omit<IGame, 'id'> = {
      ...gameInput,
      participants: [...playersIds, gameInput.host.uid],
      creatorId: currentUser.uid,
    };
    const newGame = {
      ...newGameData,
      ...meta,
    };

    const { id } = await this.gamesCollection.add(newGame as IGame & IDocumentMeta);

    return {
      ...newGame,
      id,
    };
  }

  @Query(() => GameOutput, { name: 'game' })
  async getGame(@Args() args: GetGameArgs): Promise<GameOutput> {
    const gameDoc = await this.gamesCollection.doc(args.id).get();
    const gameData = gameDoc.data();

    if (!gameData) {
      throw new ApolloError('Game not found', GameErrorCode.NOT_FOUND);
    }

    return { ...gameData, id: gameDoc.id };
  }

  @Query(() => [LastGamesByPlayerIdOutput], { name: 'playersLastGames' })
  async getLastGamesByPlayerId(
    @Args() args: GetLastGamesByPlayerIdArgs,
  ): Promise<LastGamesByPlayerIdOutput[]> {
    const participatedGames = await this.gamesCollection
      .where('participants', 'array-contains', args.playerId)
      .limit(args.limit || 10)
      .get();
    const gamesData = participatedGames.docs.map((gameDoc) => {
      const gameData = gameDoc.data();
      const playerRole = gameData.roles[args.playerId];
      const isMafia = playerRole === Role.DON || playerRole === Role.MAFIA;
      const isCitizen = playerRole === Role.SHERIFF || playerRole === Role.CITIZEN;
      const wonAsMafia = isMafia && gameData.result === GameResult.MAFIA;
      const wonAsCitizen = isCitizen && gameData.result === GameResult.CIVILIANS;
      let won: boolean; // will remain undefined if player is host, or if game results in tie

      if (wonAsMafia || wonAsCitizen) {
        won = true;
      }

      return ({
        ...gameData,
        id: gameDoc.id,
        won,
      });
    });

    return gamesData;
  }
}
