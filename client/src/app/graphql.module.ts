import { NgModule } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ApolloClientOptions, ApolloLink, InMemoryCache } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { environment } from 'src/environments/environment';

const region = 'us-central1';
const emulatorUrl = `http://localhost:5001/mafia-consigliere-develop/${region}/api/graphql`;
const projectName = environment.production ? 'mafia-consigliere' : 'mafia-consigliere-develop';
const remoteUrl = `https://${region}-${projectName}.cloudfunctions.net/api/graphql`;
const uri = environment.emulation ? emulatorUrl : remoteUrl;

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
