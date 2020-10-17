import { FirebaseFirestoreService } from '@aginix/nestjs-firebase-admin';
import { CanActivate, Injectable } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ApolloError } from 'apollo-server-express';

import { IGQLContext } from '@/interfaces/gql-context.interface';
import { ClubsCollection } from '@/models/collections.types';

import { CollectionName } from '~types/enums/colletion-name.enum';
import { ClubErrorCode, ClubAdminErrorCode } from '~types/enums/error-code.enum';

@Injectable()
export class ClubMemberGuard implements CanActivate {
  private clubsCollection = this.firestore.collection(CollectionName.CLUBS) as ClubsCollection;

  constructor(private firestore: FirebaseFirestoreService) {}

  async canActivate(executionContextHost: ExecutionContextHost): Promise<boolean> {
    const gqlContext = GqlExecutionContext.create(executionContextHost);
    const { user } = gqlContext.getContext<IGQLContext>();
    const { clubId } = gqlContext.getArgs<{ clubId: string }>();

    const clubDoc = await this.clubsCollection.doc(clubId).get();
    const clubData = clubDoc.data();

    if (!clubData) {
      throw new ApolloError('Club not found', ClubErrorCode.NOT_FOUND);
    }

    if (clubData.members.includes(user.uid)) {
      throw new ApolloError('Only club member can add games for a club', ClubAdminErrorCode.NOT_ENOUGH_PERMISSIONS);
    }

    return true;
  }
}
