import { Component, Input, OnInit } from '@angular/core';

import { ClubRole, ClubsPageQuery } from '@/graphql/gql.generated';

@Component({
  selector: 'app-clubs-list',
  templateUrl: './clubs-list.component.html',
  styleUrls: ['./clubs-list.component.scss'],
})
export class ClubsListComponent implements OnInit {
  @Input() loading: boolean;
  @Input() clubs: ClubsPageQuery['currentPlayerClubs'];

  get administratedClubs() {
    return this.clubs.filter(({ role }) => role === ClubRole.Admin);
  }

  get confidantClubs() {
    return this.clubs.filter(({ role }) => role === ClubRole.Confidant);
  }

  get memberClubs() {
    return this.clubs.filter(({ role }) => role === ClubRole.Member);
  }

  constructor() { }

  ngOnInit() {}
}
