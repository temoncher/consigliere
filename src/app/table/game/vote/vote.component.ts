import { Component, OnInit, OnDestroy } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { VotePhase } from '@/table/models/vote-phase.enum';
import { GameService } from '@/table/services/game.service';
import { VoteService } from '@/table/services/vote.service';
import { CurrentVoteState } from '@/table/store/round/current-vote/current-vote.state';

@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styles: [`
    :host {
      flex: 1;
    }
  `],
})
export class VoteComponent implements OnInit, OnDestroy {
  private destroy: Subject<boolean> = new Subject<boolean>();
  @Select(CurrentVoteState.getPhase) votePhase$: Observable<VotePhase>;

  currentVotePhase: VotePhase;

  VotePhase = VotePhase;

  constructor(
    private voteService: VoteService,
    private gameService: GameService,
  ) {
    this.votePhase$.pipe(takeUntil(this.destroy))
      .subscribe((newVotePhase) => this.currentVotePhase = newVotePhase);
  }

  ngOnInit() { }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.unsubscribe();
  }

  nextStage() {
    switch (this.currentVotePhase) {
      case VotePhase.ELIMINATE_VOTE:
        this.voteService.endEliminateVote();

        return;
      case VotePhase.RESULT:
        this.gameService.endVote();

        return;
      case VotePhase.SPEECH:
        this.voteService.endAdditionalSpeech();

        return;
      case VotePhase.VOTE:
        this.voteService.endVoteStage();

        break;
      default:
        break;
    }
  }
}
