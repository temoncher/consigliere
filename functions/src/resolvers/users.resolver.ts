import { FirebaseFirestoreService } from '@aginix/nestjs-firebase-admin';
import { HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';

import { CollectionName } from '@/enums/colletion-name.enum';
import { AuthGuard } from '@/guards/auth.guard';
import { User } from '@/models/user.model';

import { GetUserArgs, GetUsersArgs } from './users.types';

type UsersCollection = FirebaseFirestore.CollectionReference<User>;

@Resolver(() => User)
@UseGuards(AuthGuard)
export class UsersResolver {
  private usersCollection = this.firestore.collection(CollectionName.USERS) as UsersCollection;

  constructor(private firestore: FirebaseFirestoreService) {}

  @Query(() => User, { name: 'user' })
  async getUser(@Args() args: GetUserArgs): Promise<User> {
    if (Object.keys(args).length > 1) {
      throw new HttpException('Must provide only one property to query on', HttpStatus.BAD_REQUEST);
    }

    if (args.id) {
      const userDoc = await this.usersCollection.doc(args.id).get();
      const userData = userDoc.data();

      return userData;
    }

    if (args.nickname) {
      const userDocs = await this.usersCollection.where('nickname', '==', args.nickname).get();

      if (userDocs.size === 0) {
        throw new HttpException(`User with nickname "${args.nickname}" is not found`, HttpStatus.NOT_FOUND);
      }

      const userData = userDocs.docs[0].data();

      return userData;
    }

    throw new HttpException('Incorrect arguments passed', HttpStatus.BAD_REQUEST);
  }

  @Query(() => [User], { name: 'users' })
  async getUsers(@Args() args: GetUsersArgs): Promise<User[]> {
    if (Object.keys(args).length > 1) {
      throw new HttpException('Must provide only one property to query on', HttpStatus.BAD_REQUEST);
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

    throw new HttpException('Incorrect arguments passed', HttpStatus.BAD_REQUEST);
  }
}
