import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { combineLatest, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SwiperOptions } from 'swiper';

import { CurrentVoteState } from '@shared/store/game/round/current-vote/current-vote.state';
import { VoteResult } from '@shared/models/table/vote-result.enum';
import { EndVote } from '@shared/store/game/round/current-vote/current-vote.actions';
import { PlayersState } from '@shared/store/game/players/players.state';
import { Player } from '@shared/models/player.model';
import { defaultAvatarSrc } from '@shared/constants/avatars';

@Component({
  selector: 'app-vote-results',
  templateUrl: './vote-results.component.html',
  styleUrls: ['./vote-results.component.scss'],
})
export class VoteResultsComponent implements OnInit, OnDestroy {
  private destroy: Subject<boolean> = new Subject<boolean>();
  @Select(PlayersState.getPlayers) players$: Observable<Player[]>;
  @Select(CurrentVoteState.getLeaders) leaders$: Observable<string[]>;
  @Select(CurrentVoteState.getVoteResult) voteResult$: Observable<VoteResult>;

  defaultAvatar = defaultAvatarSrc;
  VoteResult = VoteResult;

  eliminatedPlayers: Player[] = [];

  playerSliderConfig: SwiperOptions = {
    spaceBetween: 0,
    centeredSlides: true,
    slidesPerView: 1.4,
  };

  constructor(
    private store: Store,
  ) {
    combineLatest([this.players$, this.leaders$])
      .pipe(takeUntil(this.destroy))
      .subscribe(([players, ledaerIds]) => this.eliminatedPlayers = players.filter(({ user: { id } }) => ledaerIds?.includes(id)));
  }

  ngOnInit() { }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.unsubscribe();
  }

  endVote() {
    this.store.dispatch(new EndVote());
  }
}
