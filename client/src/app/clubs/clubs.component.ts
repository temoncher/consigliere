import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { switchMap } from 'rxjs/operators';

import { CurrentPlayerClubsGQL, CurrentPlayerClubsQuery } from '@/graphql/gql.generated';

enum ClubsPageState {
  CREATE = 'CREATE',
  JOIN = 'JOIN',
  LIST = 'LIST',
}

@Component({
  selector: 'app-clubs',
  templateUrl: 'clubs.component.html',
  styleUrls: ['clubs.component.scss'],
})
export class ClubsComponent {
  clubs: CurrentPlayerClubsQuery['currentPlayerClubs'];
  loading = true;

  ClubsPageState = ClubsPageState;
  pageState = ClubsPageState.LIST;

  constructor(
    private fireauth: AngularFireAuth,
    private clubsPageGQL: CurrentPlayerClubsGQL,
  ) {
    this.fireauth.user.pipe(
      switchMap(() => this.clubsPageGQL.watch().valueChanges),
    ).subscribe(({ data, loading }) => {
      this.loading = loading;
      this.clubs = data.currentPlayerClubs;
    });
  }

  join() {
    if (this.pageState !== ClubsPageState.JOIN) {
      this.pageState = ClubsPageState.JOIN;

      return;
    }

    this.pageState = ClubsPageState.LIST;
  }

  create() {
    if (this.pageState !== ClubsPageState.CREATE) {
      this.pageState = ClubsPageState.CREATE;

      return;
    }

    this.pageState = ClubsPageState.LIST;
  }

  resetPage() {
    this.pageState = ClubsPageState.LIST;
  }
}
