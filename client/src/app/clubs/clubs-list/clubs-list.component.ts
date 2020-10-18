import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';

import { ClubRole, CurrentPlayerClubsQuery } from '@/graphql/gql.generated';
import { consigliereLogo } from '@/shared/constants/avatars';

@Component({
  selector: 'app-clubs-list',
  templateUrl: './clubs-list.component.html',
  styleUrls: ['./clubs-list.component.scss'],
})
export class ClubsListComponent {
  @Input() loading: boolean;
  @Input() clubs: CurrentPlayerClubsQuery['currentPlayerClubs'];

  get administratedClubs(): CurrentPlayerClubsQuery['currentPlayerClubs'] {
    return this.clubs.filter(({ role }) => role === ClubRole.Admin);
  }

  get confidantClubs(): CurrentPlayerClubsQuery['currentPlayerClubs'] {
    return this.clubs.filter(({ role }) => role === ClubRole.Confidant);
  }

  get memberClubs(): CurrentPlayerClubsQuery['currentPlayerClubs'] {
    return this.clubs.filter(({ role }) => role === ClubRole.Member);
  }

  defaultClubAvatar = consigliereLogo;

  constructor(
    private store: Store,
    private activatedRoute: ActivatedRoute,
  ) { }

  navigateToClub(clubId: string): void {
    this.store.dispatch(new Navigate(
      [clubId],
      undefined,
      { relativeTo: this.activatedRoute },
    ));
  }
}
