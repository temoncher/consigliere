import { NgModule } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ApolloClientOptions, ApolloLink, InMemoryCache } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { environment } from 'src/environments/environment';

const REGION = 'us-central1';
const PROJECT_ID = environment.firebaseConfig.projectId;

const EMULATOR_URL = `http://localhost:5001/mafia-consigliere-develop/${REGION}/api/graphql`;
const REMOTE_URL = `https://${REGION}-${PROJECT_ID}.cloudfunctions.net/api/graphql`;

const uri = environment.emulation ? EMULATOR_URL : REMOTE_URL;

export function createApollo(httpLink: HttpLink, fireauth: AngularFireAuth): ApolloClientOptions<any> {
  const basic = setContext(() => ({
    headers: {
      Accept: 'charset=utf-8',
    },
  }));

  const auth = setContext(async (operation, { headers }) => {
    const currentUser = await fireauth.currentUser;
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
      deps: [HttpLink, AngularFireAuth],
    },
  ],
})
export class GraphQLModule {}
