import { FirebaseFirestoreService } from '@aginix/nestjs-firebase-admin';
import { UseGuards } from '@nestjs/common';
import { Args, Context, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import * as admin from 'firebase-admin';

import { CollectionName } from '@/enums/colletion-name.enum';
import { AuthGuard } from '@/guards/auth.guard';
import { IClub } from '@/interfaces/club.interface';
import { IDocumentMeta } from '@/interfaces/document-meta.interface';

import { ClubsInputs, GetClubArgs, NewClubInput } from './clubs.input';
import { ClubOutput } from './clubs.output';

type ClubsCollection = FirebaseFirestore.CollectionReference<IClub & IDocumentMeta>;

@Resolver()
@UseGuards(AuthGuard)
export class ClubsResolver {
  private clubsCollection = this.firestore.collection(CollectionName.CLUBS) as ClubsCollection;

  constructor(private firestore: FirebaseFirestoreService) {}

  @Mutation(() => ID)
  async createClub(
    @Args(ClubsInputs.NEW_CLUB) newClub: NewClubInput,
      @Context('user') currentUser: admin.auth.UserRecord,
  ): Promise<string> {
    const club = {
      title: newClub.title,
      admin: currentUser.uid,
      confidants: [],
      members: [],
    } as IClub & IDocumentMeta; // Metadata will be added by firestore hooks
    const { id } = await this.clubsCollection.add(club);

    return id;
  }

  @Query(() => ClubOutput)
  async getClub(@Args() args: GetClubArgs): Promise<IClub & IDocumentMeta> {
    const clubDoc = await this.clubsCollection.doc(args.id).get();
    const clubData = { ...clubDoc.data(), id: clubDoc.id };

    return clubData;
  }
}
