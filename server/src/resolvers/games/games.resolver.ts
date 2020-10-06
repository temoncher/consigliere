import { FirebaseFirestoreService } from '@aginix/nestjs-firebase-admin';
import { UseGuards } from '@nestjs/common';
import { Args, Context, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ApolloError } from 'apollo-server-express';
import * as admin from 'firebase-admin';

import { ErrorCode } from '@/enums/apollo-code.enum';
import { CollectionName } from '@/enums/colletion-name.enum';
import { AuthGuard } from '@/guards/auth.guard';
import { IDocumentMeta } from '@/interfaces/document-meta.interface';
import { IGame } from '@/interfaces/game.interface';

import { GameInput, GetGameArgs, GetLastGamesArgs } from './games.input';
import { GameOutput } from './games.output';

type GamesCollection = FirebaseFirestore.CollectionReference<IGame & IDocumentMeta>;

@Resolver()
@UseGuards(AuthGuard)
export class GamesResolver {
  private gamesCollection = this.firestore.collection(CollectionName.GAMES) as GamesCollection;

  constructor(private firestore: FirebaseFirestoreService) {}

  @Mutation(() => ID)
  async addGame(
    @Args('addGameData') gameInput: GameInput,
      @Context('user') currentUser: admin.auth.UserRecord,
  ): Promise<string> {
    const playersIds = gameInput.players.map((player) => player.uid);

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

    const newGameDoc = await this.gamesCollection.add(newGame as IGame & IDocumentMeta);

    return newGameDoc.id;
  }

  @Query(() => GameOutput, { name: 'game' })
  async getGame(@Args() args: GetGameArgs): Promise<(IGame & IDocumentMeta)> {
    const gameDoc = await this.gamesCollection.doc(args.id).get();
    const gameData = gameDoc.data();

    if (!gameData) {
      throw new ApolloError('Game not found', ErrorCode.NOT_FOUND);
    }

    return { ...gameData, id: gameDoc.id };
  }

  @Query(() => [GameOutput], { name: 'lastGames' })
  async getLastGames(@Args() args: GetLastGamesArgs): Promise<(IGame & IDocumentMeta)[]> {
    const participatedGames = await this.gamesCollection
      .where('participants', 'array-contains', args.playerId)
      .limit(args.limit || 10)
      .get();
    const gameData = participatedGames.docs.map((gameDoc) => ({ ...gameDoc.data(), id: gameDoc.id }));

    return gameData;
  }
}
