import { NgModule } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ApolloClientOptions, ApolloLink, InMemoryCache } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { environment } from 'src/environments/environment';

import { LoggerService } from './table/services/logger.service';

const REGION = 'us-central1';
const PROJECT_ID = environment.firebaseConfig.projectId;

const EMULATOR_URL = `http://localhost:5001/mafia-consigliere-develop/${REGION}/api/graphql`;
const REMOTE_URL = `https://${REGION}-${PROJECT_ID}.cloudfunctions.net/api/graphql`;

const uri = environment.emulation ? EMULATOR_URL : REMOTE_URL;

export function createApollo(
  httpLink: HttpLink,
  fireauth: AngularFireAuth,
  logger: LoggerService,
): ApolloClientOptions<any> {
  logger.log('Creating apollo client...');
  logger.log('Using project: ', PROJECT_ID);
  logger.log('On URI: ', uri);

  const basic = setContext(() => ({
    headers: {
      Accept: 'charset=utf-8',
    },
  }));

  const auth = setContext(async (operation, { headers }) => {
    const currentUser = await fireauth.currentUser;

    if (!currentUser) throw new Error('Current user is not avalible');

    const token = await currentUser.getIdToken();

    const newHeaders: { Authorization: string } = {
      ...headers,
      Authorization: `Bearer ${token}`,
    };

    return { headers: newHeaders };
  });

  const link = ApolloLink.from([basic, auth, httpLink.create({ uri })]);
  const cache = new InMemoryCache();

  return {
    link,
    cache,
  };
}

@NgModule({
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink, AngularFireAuth, LoggerService],
    },
  ],
})
export class GraphQLModule {}
