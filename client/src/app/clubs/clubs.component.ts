import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { map, switchMap } from 'rxjs/operators';

import { ClubRole, ClubsPageGQL, ClubsPageQuery } from '@/graphql/gql.generated';

@Component({
  selector: 'app-clubs',
  templateUrl: 'clubs.component.html',
  styleUrls: ['clubs.component.scss'],
})
export class ClubsComponent {
  administratedClubs: ClubsPageQuery['currentPlayerClubs'];
  confidantClubs: ClubsPageQuery['currentPlayerClubs'];
  memberClubs: ClubsPageQuery['currentPlayerClubs'];

  get isAnyClubsPresent() {
    return this.administratedClubs?.length
      || this.confidantClubs?.length
      || this.memberClubs?.length;
  }

  constructor(
    private fireauth: AngularFireAuth,
    private clubsPageGQL: ClubsPageGQL,
  ) {
    this.fireauth.user.pipe(
      switchMap(() => this.clubsPageGQL.watch().valueChanges),
      map((clubsPageQuery) => clubsPageQuery.data),
    ).subscribe(({ currentPlayerClubs: clubs }) => {
      this.administratedClubs = clubs.filter(({ role }) => role === ClubRole.Admin);
      this.confidantClubs = clubs.filter(({ role }) => role === ClubRole.Confidant);
      this.memberClubs = clubs.filter(({ role }) => role === ClubRole.Member);
    });
  }
}
