import { HttpHeaders } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ApolloClientOptions, ApolloLink, InMemoryCache } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { environment } from 'src/environments/environment';

// eslint-disable-next-line no-nested-ternary
const baseUri = environment.emulation
  ? 'http://localhost:5001/'
  : environment.production ? 'http://mafia-consigliere.web.app/' : 'http://mafia-consigliere-develop.web.app/';
const uri = `${baseUri}mafia-consigliere-develop/us-central1/api/graphql`;

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
