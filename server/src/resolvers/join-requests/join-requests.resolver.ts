import { FirebaseFirestoreService } from '@aginix/nestjs-firebase-admin';
import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ApolloError, ForbiddenError, ValidationError } from 'apollo-server-express';
import * as admin from 'firebase-admin';

import { AuthGuard } from '@/guards/auth.guard';
import { IDocumentMeta } from '@/interfaces/document-meta.interface';
import { IJoinRequest } from '@/interfaces/join-request.interface';
import { ClubsCollection, JoinRequestsCollection } from '@/models/collections.types';

import { JoinRequestInput, JoinRequestInputNames } from './join-requests.input';
import { JoinRequestOutput } from './join-requests.output';

import { CollectionName } from '~types/enums/colletion-name.enum';
import { ClubErrorCode, ErrorCode } from '~types/enums/error-code.enum';
import { InvitationStatus } from '~types/enums/invitation-status.enum';

@Resolver()
@UseGuards(AuthGuard)
export class JoinRequestsResolver {
  private clubsCollection = this.firestore.collection(CollectionName.CLUBS) as ClubsCollection;
  private joinRequestsCollection = this.firestore.collection(CollectionName.JOIN_REQUESTS) as JoinRequestsCollection;

  constructor(private firestore: FirebaseFirestoreService) {}

  @Mutation(() => JoinRequestOutput)
  async createJoinRequest(
    @Args('clubId') clubId: string,
      @Context('user') currentUser: admin.auth.UserRecord,
  ): Promise<JoinRequestOutput> {
    const clubDoc = await this.clubsCollection.doc(clubId).get();
    const clubData = clubDoc.data();

    if (!clubData) {
      throw new ApolloError('Club not found', ClubErrorCode.NOT_FOUND);
    }

    if (clubData.members.includes(currentUser.uid)) {
      throw new ValidationError('Player is already a member of this club');
    }

    const existingRequestsDocs = await this.joinRequestsCollection
      .where('playerId', '==', currentUser.uid)
      .where('clubId', '==', clubId)
      .where('status', '==', InvitationStatus.PENDING)
      .get();

    if (existingRequestsDocs.docs.length) {
      throw new ValidationError('Player has already sent request to this club');
    }

    const meta: IDocumentMeta = {
      createdAt: admin.firestore.Timestamp.now(),
      createdBy: currentUser.uid,
      updatedAt: admin.firestore.Timestamp.now(),
      updatedBy: currentUser.uid,
    };
    const joinRequest: Omit<IJoinRequest, 'id'> = {
      clubId,
      playerId: currentUser.uid,
      status: InvitationStatus.PENDING,
    };

    const newJoinRequest = {
      ...joinRequest,
      ...meta,
    };

    const { id } = await this.joinRequestsCollection.add(newJoinRequest as IJoinRequest & IDocumentMeta);

    return {
      ...newJoinRequest,
      id,
    };
  }

  @Mutation(() => JoinRequestOutput)
  async revokeJoinRequest(
    @Args('id') id: string,
      @Context('user') currentUser: admin.auth.UserRecord,
  ): Promise<JoinRequestOutput> {
    const joinRequestDoc = await this.joinRequestsCollection.doc(id).get();
    const joinRequestData = joinRequestDoc.data();

    if (!joinRequestData) {
      throw new ApolloError('Join request not found', ErrorCode.NOT_FOUND);
    }

    if (joinRequestData.playerId !== currentUser.uid) {
      throw new ForbiddenError('Player can only revoke owned join requests');
    }

    if (joinRequestData.status !== InvitationStatus.PENDING) {
      throw new ValidationError('Player can only revoke join requests in pending status');
    }

    await this.joinRequestsCollection.doc(id).delete();

    return {
      ...joinRequestData,
      id,
    };
  }

  @Query(() => [JoinRequestOutput], { name: 'clubJoinRequests' })
  async getClubJoinRequests(
    @Args(JoinRequestInputNames.NEW_JOIN_REQUEST) joinRequestInput: JoinRequestInput,
      @Context('user') currentUser: admin.auth.UserRecord,
  ): Promise<JoinRequestOutput[]> {
    const clubDoc = await this.clubsCollection.doc(joinRequestInput.clubId).get();
    const clubData = clubDoc.data();

    if (clubData) {
      throw new ApolloError('Club not found', ClubErrorCode.NOT_FOUND);
    }

    const isAdmin = clubData.admin === currentUser.uid;
    const isConfidant = clubData.confidants.includes(currentUser.uid);

    if (!isAdmin && !isConfidant) {
      throw new ForbiddenError('Only admins and confidants can get list of join requests');
    }

    let joinRequestDocsRef = this.joinRequestsCollection
      .where('clubId', '==', joinRequestInput.clubId);

    if (joinRequestInput.statuses) {
      joinRequestDocsRef = joinRequestDocsRef.where('status', 'array-contains-any', joinRequestInput.statuses);
    }

    const joinRequestDocs = await joinRequestDocsRef.get();
    const joinRequestData = joinRequestDocs.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

    return joinRequestData;
  }
}
