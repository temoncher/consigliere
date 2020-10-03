import { FirebaseFirestoreService } from '@aginix/nestjs-firebase-admin';
import { HttpStatus, UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { ApolloError, ValidationError } from 'apollo-server-express';

import { CollectionName } from '@/enums/colletion-name.enum';
import { AuthGuard } from '@/guards/auth.guard';
import { User } from '@/models/user.model';

import { GetUserArgs, GetUsersArgs } from './users.types';
import { ErrorCode } from '@/enums/apollo-code.enum';

type UsersCollection = FirebaseFirestore.CollectionReference<User>;

@Resolver(() => User)
@UseGuards(AuthGuard)
export class UsersResolver {
  private usersCollection = this.firestore.collection(CollectionName.USERS) as UsersCollection;

  constructor(private firestore: FirebaseFirestoreService) {}

  @Query(() => User, { name: 'user' })
  async getUser(@Args() args: GetUserArgs): Promise<User> {
    if (Object.keys(args).length > 1) {
      throw new ValidationError('Must provide only one property to query on');
    }

    let userData: User;

    if (args.id) {
      const userDoc = await this.usersCollection.doc(args.id).get();

      userData = userDoc.data();
    }

    if (args.nickname) {
      const userDocs = await this.usersCollection.where('nickname', '==', args.nickname).get();

      if (userDocs.size === 0) {
        throw new ApolloError(`User with nickname "${args.nickname}" is not found`, ErrorCode.NOT_FOUND);
      }

      userData = userDocs.docs[0].data();
    }

    if (!userData) {
      throw new ApolloError('User not found', ErrorCode.NOT_FOUND);
    }

    throw new ValidationError('Incorrect arguments passed');
  }

  @Query(() => [User], { name: 'users' })
  async getUsers(@Args() args: GetUsersArgs): Promise<User[]> {
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
