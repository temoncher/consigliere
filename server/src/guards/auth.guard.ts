import { FirebaseAuthenticationService } from '@aginix/nestjs-firebase-admin';
import { CanActivate, Injectable } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthenticationError } from 'apollo-server-express';
import * as admin from 'firebase-admin';

import { IGQLContext } from '@/interfaces/gql-context.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private firebaseAuth: FirebaseAuthenticationService) {}

  async canActivate(executionContextHost: ExecutionContextHost): Promise<boolean> {
    const gqlContext = GqlExecutionContext.create(executionContextHost).getContext<IGQLContext>();

    if (!gqlContext.headers.authorization) {
      throw new AuthenticationError('Authorization header is missing');
    }

    const decodedToken = await this.decodeToken(gqlContext.headers.authorization);

    gqlContext.user = await this.firebaseAuth.getUser(decodedToken.uid);

    return true;
  }

  async decodeToken(authHeader: string): Promise<admin.auth.DecodedIdToken> {
    const [bearerTag, token] = authHeader.split(' ');

    if (bearerTag !== 'Bearer') {
      throw new AuthenticationError('Token bearer is missing');
    }

    try {
      const decodedToken = await this.firebaseAuth.verifyIdToken(token);

      return decodedToken;
    } catch {
      throw new AuthenticationError('Invalid token');
    }
  }
}
