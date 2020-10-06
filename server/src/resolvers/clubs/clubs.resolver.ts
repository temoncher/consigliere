import { FirebaseFirestoreService } from '@aginix/nestjs-firebase-admin';
import { UseGuards } from '@nestjs/common';
import { Args, Context, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ApolloError, ValidationError } from 'apollo-server-express';
import * as admin from 'firebase-admin';

import { ErrorCode } from '@/enums/apollo-code.enum';
import { CollectionName } from '@/enums/colletion-name.enum';
import { AuthGuard } from '@/guards/auth.guard';
import { IClub } from '@/interfaces/club.interface';
import { IDocumentMeta } from '@/interfaces/document-meta.interface';

import { ClubsInputs, GetClubArgs, GetClubsByPlayerIdArgs, NewClubInput } from './clubs.input';
import { ClubOutput } from './clubs.output';

type ClubsCollection = FirebaseFirestore.CollectionReference<IClub & IDocumentMeta>;

@Resolver()
@UseGuards(AuthGuard)
export class ClubsResolver {
  private clubsCollection = this.firestore.collection(CollectionName.CLUBS) as ClubsCollection;

  constructor(private firestore: FirebaseFirestoreService) {}

  @Mutation(() => ID)
  async createClub(
    @Args(ClubsInputs.NEW_CLUB) newClubInput: NewClubInput,
      @Context('user') currentUser: admin.auth.UserRecord,
  ): Promise<string> {
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

    return id;
  }

  @Query(() => ClubOutput, { name: 'club' })
  async getClub(@Args() args: GetClubArgs): Promise<IClub & IDocumentMeta> {
    const clubDoc = await this.clubsCollection.doc(args.id).get();
    const clubData = clubDoc.data();

    if (!clubData) {
      throw new ApolloError('Club not found', ErrorCode.NOT_FOUND);
    }

    console.log('created', clubData.createdAt);

    return { ...clubData, id: clubDoc.id };
  }

  @Query(() => [ClubOutput], { name: 'playerClubs' })
  async getClubsByPlayerId(@Args() args: GetClubsByPlayerIdArgs): Promise<(IClub & IDocumentMeta)[]> {
    const playersClubs = await this.clubsCollection.where('members', 'array-contains', args.playerId).get();
    const playersClubsData = playersClubs.docs.map((club) => club.data());

    return playersClubsData;
  }
}
