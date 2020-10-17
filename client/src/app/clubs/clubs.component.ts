import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { IClub } from '@/shared/interfaces/club.interface';
import { ClubsApi } from '@/shared/services/api/clubs.api';

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
  clubs$: Observable<IClub[]> = this.clubsApi.userClubs$;
  loading = true;

  ClubsPageState = ClubsPageState;
  pageState = ClubsPageState.LIST;

  constructor(private clubsApi: ClubsApi) {
    this.clubs$.pipe(
      take(1),
    ).subscribe(() => this.loading = false);
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
