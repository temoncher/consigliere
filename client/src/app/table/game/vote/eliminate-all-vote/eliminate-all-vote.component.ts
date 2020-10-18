import { Component, OnDestroy } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Player } from '@/shared/models/player.model';
import { VoteService } from '@/table/services/vote.service';
import { PlayersState } from '@/table/store/players/players.state';
import { VoteForElimination } from '@/table/store/round/current-vote/current-vote.actions';
import { CurrentVoteState } from '@/table/store/round/current-vote/current-vote.state';

import { IQuitPhase } from '~types/interfaces/quit-phase.interface';

@Component({
  selector: 'app-eliminate-all-vote',
  templateUrl: './eliminate-all-vote.component.html',
  styleUrls: ['./eliminate-all-vote.component.scss'],
})
export class EliminateAllVoteComponent implements OnDestroy {
  private destroy: Subject<boolean> = new Subject<boolean>();

  @Select(CurrentVoteState.getEliminateVote) eliminateAllVote$: Observable<Record<string, boolean> | undefined>;
  @Select(PlayersState.getQuitPhases) quitPhases$: Observable<Record<string, IQuitPhase>>;
  @Select(PlayersState.getPlayers) players$: Observable<Player[]>;

  eliminateVote: Record<string, boolean> = {};
  quitPhases: Record<string, IQuitPhase>;

  get votedPlayersNumber(): number {
    const eliminateVote = this.store.selectSnapshot(CurrentVoteState.getEliminateVote);

    return Object.keys(eliminateVote || {}).length;
  }

  constructor(
    private store: Store,
    private voteService: VoteService,
  ) {
    this.quitPhases$
      .pipe(takeUntil(this.destroy))
      .subscribe((quitPhases) => this.quitPhases = quitPhases);

    this.eliminateAllVote$
      .pipe(takeUntil(this.destroy))
      .subscribe((eliminateVote) => this.eliminateVote = eliminateVote || {});
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.unsubscribe();
  }

  switchVote(playerId: string): void {
    this.store.dispatch(new VoteForElimination(playerId));
  }

  endEliminateVote(): void {
    this.voteService.endEliminateVote();
  }
}
