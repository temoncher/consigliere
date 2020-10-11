import { FirebaseAdminModule } from '@aginix/nestjs-firebase-admin';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import * as admin from 'firebase-admin';

import { ResolversModule } from './resolvers/resolvers.module';

@Module({
  imports: [
    FirebaseAdminModule.forRootAsync({
      useFactory: () => ({
        credential: admin.credential.applicationDefault(),
      }),
    }),
    GraphQLModule.forRoot({
      path: '/graphql',
      autoSchemaFile: true,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      context: ({ req }) => ({ headers: req.headers }),
      buildSchemaOptions: {
        dateScalarMode: 'timestamp',
      },
    }),
    ResolversModule,
  ],
})
export class AppModule {}
