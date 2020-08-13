import { Component, OnInit, OnDestroy } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';

import { CurrentVoteState } from '@shared/store/game/round/current-vote/current-vote.state';
import { VotePhase } from '@shared/models/table/vote-phase.enum';
import { takeUntil } from 'rxjs/operators';
import { MenuController } from '@ionic/angular';
import { GameService } from '@shared/services/game.service';
import { VoteService } from '@shared/services/vote.service';

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
    private menuController: MenuController,
    private voteService: VoteService,
    private gameService: GameService,
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
