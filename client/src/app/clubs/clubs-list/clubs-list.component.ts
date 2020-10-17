import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';

import { consigliereLogo } from '@/shared/constants/avatars';
import { IClub } from '@/shared/interfaces/club.interface';

import { ClubRole } from '~types/enums/club-role.enum';

@Component({
  selector: 'app-clubs-list',
  templateUrl: './clubs-list.component.html',
  styleUrls: ['./clubs-list.component.scss'],
})
export class ClubsListComponent implements OnInit {
  @Input() loading: boolean;
  @Input() clubs?: IClub[];

  get administratedClubs() {
    return this.clubs.filter(({ role }) => role === ClubRole.ADMIN);
  }

  get confidantClubs() {
    return this.clubs.filter(({ role }) => role === ClubRole.CONFIDANT);
  }

  get memberClubs() {
    return this.clubs.filter(({ role }) => role === ClubRole.MEMBER);
  }

  defaultClubAvatar = consigliereLogo;

  constructor(
    private store: Store,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {}

  navigateToClub(clubId: string) {
    this.store.dispatch(new Navigate([clubId], null, { relativeTo: this.activatedRoute }));
  }
}
