import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { Subject } from 'rxjs';
import { debounceTime, filter, switchMap, tap, takeUntil } from 'rxjs/operators';

import { SearchClubsGQL, SearchClubsQuery } from '@/graphql/gql.generated';
import { consigliereLogo } from '@/shared/constants/avatars';

@Component({
  selector: 'app-join-club',
  templateUrl: './join-club.component.html',
  styleUrls: ['./join-club.component.scss'],
})
export class JoinClubComponent implements OnInit, OnDestroy {
  private destroy: Subject<boolean> = new Subject<boolean>();
  clubs: SearchClubsQuery['searchClubs'];

  search = new FormControl('');
  loading = false;

  defaultClubAvatar = consigliereLogo;

  constructor(
    private store: Store,
    private activatedRoute: ActivatedRoute,
    private searchClubsGQL: SearchClubsGQL,
  ) {
    this.search.valueChanges.pipe(
      takeUntil(this.destroy),
      filter((query) => !!query),
      debounceTime(500),
      tap(() => this.loading = true),
      switchMap((query) => this.searchClubsGQL.watch({ query }).valueChanges),
    ).subscribe(({ data, loading }) => {
      this.clubs = data.searchClubs;
      this.loading = loading;
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.unsubscribe();
  }

  navigateToClub(clubId: string) {
    this.store.dispatch(new Navigate(
      [clubId],
      null,
      { relativeTo: this.activatedRoute },
    ));
  }
}
