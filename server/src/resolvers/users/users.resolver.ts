import { FirebaseFirestoreService } from '@aginix/nestjs-firebase-admin';
import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { ApolloError, ValidationError } from 'apollo-server-express';

import { AuthGuard } from '@/guards/auth.guard';
import { UsersCollection } from '@/models/collections.types';

import { GetUserArgs, GetUsersArgs } from './users.input';
import { UserOutput } from './users.output';

import { CollectionName } from '~types/enums/colletion-name.enum';
import { UserErrorCode } from '~types/enums/error-code.enum';

@Resolver()
@UseGuards(AuthGuard)
export class UsersResolver {
  private usersCollection = this.firestore.collection(CollectionName.USERS) as UsersCollection;

  constructor(private firestore: FirebaseFirestoreService) {}

  @Query(() => UserOutput, { name: 'user' })
  async getUser(@Args() args: GetUserArgs): Promise<UserOutput> {
    if (Object.keys(args).length > 1) {
      throw new ValidationError('Must provide only one property to query on');
    }

    let userData: UserOutput;

    if (args.id) {
      const userDoc = await this.usersCollection.doc(args.id).get();

      userData = userDoc.data();
    }

    if (args.nickname) {
      const userDocs = await this.usersCollection.where('nickname', '==', args.nickname).get();

      if (userDocs.size === 0) {
        throw new ApolloError(`User with nickname "${args.nickname}" is not found`, UserErrorCode.NOT_FOUND);
      }

      userData = userDocs.docs[0].data();
    }

    if (!userData) {
      throw new ApolloError('User not found', UserErrorCode.NOT_FOUND);
    }

    return userData;
  }

  @Query(() => [UserOutput], { name: 'users' })
  async getUsers(@Args() args: GetUsersArgs): Promise<UserOutput[]> {
    if (Object.keys(args).length > 1) {
      throw new ValidationError('Must provide only one property to query on');
    }

    if (args.ids) {
      const userDocs = await this.usersCollection.where('uid', 'in', args.ids).get();
      const usersData = userDocs.docs.map((doc) => doc.data());

      return usersData;
    }

    if (args.nicknames) {
      const userDocs = await this.usersCollection.where('nickname', 'in', args.nicknames).get();
      const usersData = userDocs.docs.map((doc) => doc.data());

      return usersData;
    }

    throw new ValidationError('Incorrect arguments passed');
  }
}
