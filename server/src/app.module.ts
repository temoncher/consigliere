import { FirebaseAdminModule } from '@aginix/nestjs-firebase-admin';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import * as admin from 'firebase-admin';

import { ResolversModule } from './resolvers/resolvers.module';

const FIRE_ADMIN_CREDENTIALS = admin.credential.applicationDefault();

@Module({
  imports: [
    FirebaseAdminModule.forRootAsync({
      useFactory: () => ({
        credential: FIRE_ADMIN_CREDENTIALS,
      }),
    }),
    GraphQLModule.forRoot({
      path: '/graphql',
      autoSchemaFile: true,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      context: ({ req }) => ({ headers: req.headers }),
    }),
    ResolversModule,
  ],
})
export class AppModule {}
