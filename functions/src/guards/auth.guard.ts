import { FirebaseAuthenticationService } from '@aginix/nestjs-firebase-admin';
import { CanActivate, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { GqlExecutionContext } from '@nestjs/graphql';
import * as admin from 'firebase-admin';

import { IGQLContext } from '@/interfaces/gql-context.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private firebaseAuth: FirebaseAuthenticationService) {}

  async canActivate(executionContextHost: ExecutionContextHost): Promise<boolean> {
    const gqlContext = GqlExecutionContext.create(executionContextHost).getContext<IGQLContext>();

    if (!gqlContext.headers.authorization) {
      throw new HttpException('Authorization header is missing', HttpStatus.UNAUTHORIZED);
    }

    const decodedToken = await this.decodeToken(gqlContext.headers.authorization);

    gqlContext.user = await this.firebaseAuth.getUser(decodedToken.uid);

    return true;
  }

  async decodeToken(authHeader: string): Promise<admin.auth.DecodedIdToken> {
    const [bearerTag, token] = authHeader.split(' ');

    if (bearerTag !== 'Bearer') {
      throw new HttpException('Token bearer is missing', HttpStatus.UNAUTHORIZED);
    }

    try {
      const decodedToken = await this.firebaseAuth.verifyIdToken(token);

      return decodedToken;
    } catch {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }
}
