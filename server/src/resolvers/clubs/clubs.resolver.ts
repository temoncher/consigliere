import { FirebaseFirestoreService } from '@aginix/nestjs-firebase-admin';
import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ApolloError, ForbiddenError, ValidationError } from 'apollo-server-express';
import * as admin from 'firebase-admin';

import { AuthGuard } from '@/guards/auth.guard';
import { IClub } from '@/interfaces/club.interface';
import { IDocumentMeta } from '@/interfaces/document-meta.interface';
import { ClubsCollection } from '@/models/collections.types';
import { AlgoliaService } from '@/services/algolia.service';

import { ClubsInputName, GetClubArgs, NewClubInput } from './clubs.input';
import { ClubOutput, ClubSearchOutput } from './clubs.output';

import { ClubRole } from '~types/enums/club-role.enum';
import { CollectionName } from '~types/enums/colletion-name.enum';
import { ErrorCode } from '~types/enums/error-code.enum';

@Resolver()
@UseGuards(AuthGuard)
export class ClubsResolver {
  private clubsCollection = this.firestore.collection(CollectionName.CLUBS) as ClubsCollection;

  constructor(
    private firestore: FirebaseFirestoreService,
    private algoliaService: AlgoliaService,
  ) {}

  @Mutation(() => ClubOutput)
  async createClub(
    @Args(ClubsInputName.NEW_CLUB) newClubInput: NewClubInput,
      @Context('user') currentUser: admin.auth.UserRecord,
  ): Promise<ClubOutput> {
    const { docs: clubsWithSameTitle } = await this.clubsCollection.where('title', '==', newClubInput.title).get();

    if (clubsWithSameTitle.length) {
      throw new ValidationError('Club with this title already exists');
    }

    const meta: IDocumentMeta = {
      createdAt: admin.firestore.Timestamp.now(),
      createdBy: currentUser.uid,
      updatedAt: admin.firestore.Timestamp.now(),
      updatedBy: currentUser.uid,
    };
    const newClubData: Omit<IClub, 'id'> = {
      title: newClubInput.title,
      admin: currentUser.uid,
      confidants: [],
      members: [currentUser.uid],
    };
    const newClub = {
      ...newClubData,
      ...meta,
    };

    const { id } = await this.clubsCollection.add(newClub as IClub & IDocumentMeta);

    return {
      ...newClub,
      id,
      role: ClubRole.ADMIN,
    };
  }

  @Mutation(() => ClubOutput)
  async deleteClub(
    @Args('clubId') clubId: string,
      @Context('user') currentUser: admin.auth.UserRecord,
  ): Promise<ClubOutput> {
    const clubDoc = await this.clubsCollection.doc(clubId).get();
    const clubData = clubDoc.data();

    if (!clubData) {
      throw new ApolloError('Club not found', ErrorCode.NOT_FOUND);
    }

    if (clubData.admin !== currentUser.uid) {
      throw new ForbiddenError('Only admins can delete clubs');
    }

    await this.clubsCollection.doc(clubId).delete();

    return {
      ...clubData,
      id: clubId,
      role: ClubRole.ADMIN,
    };
  }

  @Query(() => ClubOutput, { name: 'club' })
  async getClub(
    @Args() args: GetClubArgs,
      @Context('user') currentUser: admin.auth.UserRecord,
  ): Promise<ClubOutput> {
    const clubDoc = await this.clubsCollection.doc(args.id).get();
    const clubData = clubDoc.data();
    let role = ClubRole.MEMBER;

    if (clubData.confidants.includes(currentUser.uid)) {
      role = ClubRole.CONFIDANT;
    }

    if (clubData.admin === currentUser.uid) {
      role = ClubRole.ADMIN;
    }

    if (!clubData) {
      throw new ApolloError('Club not found', ErrorCode.NOT_FOUND);
    }

    return {
      ...clubData,
      id: clubDoc.id,
      role,
    };
  }

  @Query(() => [ClubOutput], { name: 'currentPlayerClubs' })
  async getCurrentPlayersClubs(
    @Context('user') currentUser: admin.auth.UserRecord,
  ): Promise<ClubOutput[]> {
    const playersClubs = await this.clubsCollection.where('members', 'array-contains', currentUser.uid).get();
    const playersClubsData = playersClubs.docs.map((clubDoc) => {
      const docData = clubDoc.data();
      let role = ClubRole.MEMBER;

      if (docData.confidants.includes(currentUser.uid)) {
        role = ClubRole.CONFIDANT;
      }

      if (docData.admin === currentUser.uid) {
        role = ClubRole.ADMIN;
      }

      return ({
        ...docData,
        id: clubDoc.id,
        role,
      });
    });

    return playersClubsData;
  }

  @Query(() => [ClubSearchOutput])
  async searchClubs(
    @Args('query') query: string,
  ): Promise<ClubSearchOutput[]> {
    const { hits } = await this.algoliaService.clubsIndex.search<IClub & IDocumentMeta & { objectID: string }>(query);
    const clubs = hits.map(({ objectID, ...hit }) => ({ ...hit, id: objectID }));

    return clubs;
  }
}
