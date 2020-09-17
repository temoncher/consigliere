import { Component, OnInit, OnDestroy } from '@angular/core';
import { Select } from '@ngxs/store';
import { VotePhase } from '@shared/models/table/vote-phase.enum';
import { GameService } from '@shared/services/game.service';
import { VoteService } from '@shared/services/vote.service';
import { CurrentVoteState } from '@shared/store/game/round/current-vote/current-vote.state';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
