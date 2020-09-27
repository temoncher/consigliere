import { Component, OnInit, OnDestroy } from '@angular/core';
import { Select } from '@ngxs/store';
import { combineLatest, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { defaultAvatarSrc } from '@/shared/constants/avatars';
import { playerSliderConfig } from '@/shared/constants/slider';
import { Player } from '@/shared/models/player.model';
import { VoteResult } from '@/table/models/vote-result.enum';
import { GameService } from '@/table/services/game.service';
import { PlayersState } from '@/table/store/players/players.state';
import { CurrentVoteState } from '@/table/store/round/current-vote/current-vote.state';

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
        this.eliminatedPlayers = players?.filter(({ user }) => ledaerIds?.includes(user.uid));
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
