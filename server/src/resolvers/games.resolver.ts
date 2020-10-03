import { FirebaseFirestoreService } from '@aginix/nestjs-firebase-admin';
import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';

import { CollectionName } from '@/enums/colletion-name.enum';
import { AuthGuard } from '@/guards/auth.guard';
import { Game } from '@/models/game.model';

import { GetGameArgs, GetLastGamesArgs } from './games.types';

type GamesCollection = FirebaseFirestore.CollectionReference<Game>;

@Resolver(() => Game)
@UseGuards(AuthGuard)
export class GamesResolver {
  private gamesCollection = this.firestore.collection(CollectionName.GAMES) as GamesCollection;

  constructor(private firestore: FirebaseFirestoreService) {}

  @Query(() => Game, { name: 'game' })
  async getGame(@Args() args: GetGameArgs): Promise<Game> {
    const gameDoc = await this.gamesCollection.doc(args.id).get();
    const gameData = { ...gameDoc.data(), id: gameDoc.id };

    return gameData;
  }

  @Query(() => [Game], { name: 'lastGames' })
  async getLastGames(@Args() args: GetLastGamesArgs): Promise<Game[]> {
    const participatedGames = await this.gamesCollection
      .where('participants', 'array-contains', args.playerId)
      .limit(args.limit || 10)
      .get();
    const gameData = participatedGames.docs.map((gameDoc) => ({ ...gameDoc.data(), id: gameDoc.id }));

    return gameData;
  }
}
