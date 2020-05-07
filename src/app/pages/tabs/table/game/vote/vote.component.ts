import { Component, OnInit, OnDestroy } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';

import { CurrentVoteState } from '@shared/store/game/round/current-vote/current-vote.state';
import { VotePhase } from '@shared/models/table/vote-phase.enum';
import {
  EndVoteStage,
  EndEliminateVote,
  EndVote,
  EndAdditionalSpeech,
} from '@shared/store/game/round/current-vote/current-vote.actions';
import { takeUntil } from 'rxjs/operators';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.scss'],
})
export class VoteComponent implements OnInit, OnDestroy {
  private destroy: Subject<boolean> = new Subject<boolean>();
  @Select(CurrentVoteState.getPhase) votePhase$: Observable<VotePhase>;

  currentVotePhase: VotePhase;

  VotePhase = VotePhase;

  constructor(
    private store: Store,
    private menuController: MenuController,
  ) {
    this.votePhase$.pipe(takeUntil(this.destroy))
      .subscribe((newVotePhase) => this.currentVotePhase = newVotePhase);
  }

  ngOnInit() { }

  openMenu() {
    this.menuController.open('game-menu');
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.unsubscribe();
  }

  nextStage() {
    switch (this.currentVotePhase) {
      case VotePhase.ELIMINATE_VOTE:
        this.store.dispatch(new EndEliminateVote());
        return;
      case VotePhase.RESULT:
        this.store.dispatch(new EndVote());
        return;
      case VotePhase.SPEECH:
        this.store.dispatch(new EndAdditionalSpeech());
        return;
      case VotePhase.VOTE:
        this.store.dispatch(new EndVoteStage());
        return;
      default:
        return;
    }
  }
}
