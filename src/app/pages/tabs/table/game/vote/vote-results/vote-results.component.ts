import { Component, OnInit, OnDestroy } from '@angular/core';
import { Select } from '@ngxs/store';
import { defaultAvatarSrc } from '@shared/constants/avatars';
import { playerSliderConfig } from '@shared/constants/slider';
import { Player } from '@shared/models/player.model';
import { VoteResult } from '@shared/models/table/vote-result.enum';
import { GameService } from '@shared/services/game.service';
import { PlayersState } from '@shared/store/game/players/players.state';
import { CurrentVoteState } from '@shared/store/game/round/current-vote/current-vote.state';
import { combineLatest, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SwiperOptions } from 'swiper';

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

  playerSliderConfig = playerSliderConfig;

  constructor(
    private gameService: GameService,
  ) {
    combineLatest([this.players$, this.leaders$])
      .pipe(takeUntil(this.destroy))
      .subscribe(([players, ledaerIds]) => {
        this.eliminatedPlayers = players?.filter(({ user }) => ledaerIds?.includes(user.id));
      });
  }

  ngOnInit() { }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.unsubscribe();
  }

  endVote() {
    this.gameService.endVote();
  }
}
