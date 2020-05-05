import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngxs/store';

import { CurrentVoteState } from '@shared/store/game/round/current-vote/current-vote.state';
import { CurrentDayState } from '@shared/store/game/round/current-day/current-day.state';
import { VoteResult } from '@shared/models/table/vote-result.enum';
import { EndVote } from '@shared/store/game/round/current-vote/current-vote.actions';

@Component({
  selector: 'app-vote-results',
  templateUrl: './vote-results.component.html',
  styleUrls: ['./vote-results.component.scss'],
})
export class VoteResultsComponent implements OnInit {
  VoteResult = VoteResult;
  currentVoteResult = VoteResult.NO_CANDIDATES;

  constructor(
    private modalController: ModalController,
    private store: Store,
  ) {
    const vote = this.store.selectSnapshot(CurrentVoteState.getCurrentVote);
    const proposedPlayers = this.store.selectSnapshot(CurrentDayState.getProposedPlayers);
    const isVoteDisabled = this.store.selectSnapshot(CurrentVoteState.getIsVoteDisabled);

    if (isVoteDisabled) {
      this.currentVoteResult = VoteResult.VOTE_IS_DISABLED;
      return;
    }

    if (!vote) {
      if (!proposedPlayers.size) {
        this.currentVoteResult = VoteResult.NO_CANDIDATES;
        return;
      }
    }

    this.currentVoteResult = VoteResult.PLAYERS_ELIMINATED;
    return;
  }

  ngOnInit() { }

  startNight() {
    this.modalController.dismiss();
    this.store.dispatch(new EndVote());
  }
}
