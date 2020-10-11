import { FirebaseFirestoreService } from '@aginix/nestjs-firebase-admin';
import { UseGuards } from '@nestjs/common';
import { Args, Context, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ApolloError, ForbiddenError } from 'apollo-server-express';
import * as fbAdmin from 'firebase-admin';

import { AuthGuard } from '@/guards/auth.guard';
import { IClub } from '@/interfaces/club.interface';
import { IDocumentMeta } from '@/interfaces/document-meta.interface';
import { ClubsCollection, UsersCollection } from '@/models/collections.types';
import { AlgoliaService } from '@/services/algolia.service';

import {
  ClubsInputName,
  GetClubArgs,
  ResignArgs,
  NewClubInput,
  SearchClubArgs,
} from './clubs.input';
import { ClubOutput, ClubSearchOutput } from './clubs.output';

import { ClubRole } from '~types/enums/club-role.enum';
import { CollectionName } from '~types/enums/colletion-name.enum';
import { ClubAdminErrorCode, ClubErrorCode, UserErrorCode } from '~types/enums/error-code.enum';

@Resolver()
@UseGuards(AuthGuard)
export class ClubsResolver {
  private clubsCollection = this.firestore.collection(CollectionName.CLUBS) as ClubsCollection;
  private usersCollection = this.firestore.collection(CollectionName.USERS) as UsersCollection;

  constructor(
    private firestore: FirebaseFirestoreService,
    private algoliaService: AlgoliaService,
  ) {}

  @Mutation(() => ClubOutput)
  async createClub(
    @Args(ClubsInputName.NEW_CLUB) newClubInput: NewClubInput,
      @Context('user') currentUser: fbAdmin.auth.UserRecord,
  ): Promise<ClubOutput> {
    const { docs: clubsWithSameTitle } = await this.clubsCollection.where('title', '==', newClubInput.title).get();

    if (clubsWithSameTitle.length) {
      throw new ApolloError('Club with this title already exists', ClubErrorCode.ALREADY_EXISTS);
    }

    const meta: IDocumentMeta = {
      createdAt: fbAdmin.firestore.Timestamp.now(),
      createdBy: currentUser.uid,
      updatedAt: fbAdmin.firestore.Timestamp.now(),
      updatedBy: currentUser.uid,
    };
    const newClubData: Omit<IClub, 'id'> = {
      ...newClubInput,
      public: true, // TODO: implement private clubs
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

  @Mutation(() => ID)
  async leaveClub(
    @Args('clubId') clubId: string,
      @Context('user') currentUser: fbAdmin.auth.UserRecord,
  ): Promise<string> {
    const clubDoc = await this.clubsCollection.doc(clubId).get();
    const clubData = clubDoc.data();

    if (!clubData) {
      throw new ApolloError('Club not found', ClubErrorCode.NOT_FOUND);
    }

    if (clubData.admin === currentUser.uid) {
      throw new ApolloError('Club admin should resign before leaving', ClubAdminErrorCode.SHOULD_RESIGN);
    }

    const members = clubData.members.filter((memberId) => memberId !== currentUser.uid);

    const meta: Partial<IDocumentMeta> = {
      updatedAt: fbAdmin.firestore.Timestamp.now(),
      updatedBy: currentUser.uid,
    };

    await this.clubsCollection.doc(clubId).set({
      ...meta,
      members,
    }, { merge: true });

    return clubDoc.id;
  }

  @Mutation(() => ClubOutput)
  async resign(
    @Args() resignArgs: ResignArgs,
      @Context('user') currentUser: fbAdmin.auth.UserRecord,
  ): Promise<ClubOutput> {
    const clubDoc = await this.clubsCollection.doc(resignArgs.clubId).get();
    const clubData = clubDoc.data();

    if (!clubData) {
      throw new ApolloError('Club not found', ClubErrorCode.NOT_FOUND);
    }

    if (clubData.admin !== currentUser.uid) {
      throw new ApolloError('Only club admin can resign', ClubErrorCode.FORBIDDEN);
    }

    if (!clubData.confidants.includes(resignArgs.successorId)) {
      throw new ApolloError('Successor should be club\'s confidant', ClubAdminErrorCode.SUCCESSOR_SHOULD_BE_CONFIDANT);
    }

    const succcessorDoc = await this.usersCollection.doc(resignArgs.successorId).get();
    const succcessorData = succcessorDoc.data();

    if (!succcessorData) {
      throw new ApolloError('Succcessor not found', UserErrorCode.NOT_FOUND);
    }

    const confidants = clubData.confidants.map((userId) => {
      if (userId !== resignArgs.successorId) return userId;

      return currentUser.uid;
    });
    const admin = resignArgs.successorId;
    const meta: Partial<IDocumentMeta> = {
      updatedAt: fbAdmin.firestore.Timestamp.now(),
      updatedBy: currentUser.uid,
    };

    await this.clubsCollection.doc(resignArgs.clubId).set({
      ...meta,
      admin,
      confidants,
    }, { merge: true });

    const newClub = {
      ...clubData,
      confidants,
      admin,
      id: clubDoc.id,
    };

    return newClub;
  }

  @Mutation(() => ClubOutput)
  async deleteClub(
    @Args('clubId') clubId: string,
      @Context('user') currentUser: fbAdmin.auth.UserRecord,
  ): Promise<ClubOutput> {
    const clubDoc = await this.clubsCollection.doc(clubId).get();
    const clubData = clubDoc.data();

    if (!clubData) {
      throw new ApolloError('Club not found', ClubErrorCode.NOT_FOUND);
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
      @Context('user') currentUser: fbAdmin.auth.UserRecord,
  ): Promise<ClubOutput> {
    const clubDoc = await this.clubsCollection.doc(args.id).get();
    const clubData = clubDoc.data();
    let role: ClubRole;

    if (clubData.members.includes(currentUser.uid)) {
      role = ClubRole.MEMBER;
    }

    if (clubData.confidants.includes(currentUser.uid)) {
      role = ClubRole.CONFIDANT;
    }

    if (clubData.admin === currentUser.uid) {
      role = ClubRole.ADMIN;
    }

    if (!clubData) {
      throw new ApolloError('Club not found', ClubErrorCode.NOT_FOUND);
    }

    return {
      ...clubData,
      id: clubDoc.id,
      role,
    };
  }

  @Query(() => [ClubOutput], { name: 'currentPlayerClubs' })
  async getCurrentPlayersClubs(
    @Context('user') currentUser: fbAdmin.auth.UserRecord,
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
    @Args() { query, limit }: SearchClubArgs,
  ): Promise<ClubSearchOutput[]> {
    const { hits } = await this.algoliaService.clubsIndex
      .search<IClub & IDocumentMeta & { objectID: string }>(query, { hitsPerPage: limit || 10 });
    const clubs = hits.map(({ objectID, ...hit }) => ({ ...hit, id: objectID }));

    return clubs;
  }
}
