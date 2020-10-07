import { FirebaseAdminModule } from '@aginix/nestjs-firebase-admin';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import * as admin from 'firebase-admin';

import { ResolversModule } from './resolvers/resolvers.module';
import * as credentials from './service-account.json';
import { AlgoliaService } from './services/algolia.service';

@Module({
  imports: [
    FirebaseAdminModule.forRootAsync({
      useFactory: () => ({
        credential: admin.credential.cert(credentials as any),
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
