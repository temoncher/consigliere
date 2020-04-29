import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { CurrentVoteState } from '@shared/store/game/current-day/current-vote/current-vote.state';
import { CurrentDayState } from '@shared/store/game/current-day/current-day.state';
import { EndVote } from '@shared/store/game/current-day/current-day.actions';

enum VoteResult {
  NO_CANDIDATES = 'NO_CANDIDATES',
  SINGLE_CANDIDATE_AND_ZERO_DAY = 'SINGLE_CANDIDATE_AND_ZERO_DAY',
  VOTE_IS_DISABLED = 'VOTE_IS_DISABLED',
  PLAYERS_ELIMINATED = 'PLAYERS_ELIMINATED',
}

@Component({
  selector: 'app-vote-results',
  templateUrl: './vote-results.component.html',
  styleUrls: ['./vote-results.component.scss'],
})
export class VoteResultsComponent implements OnInit {
  voteIsDisabledText = 'Игрок был удалён в течение дня';
  noCandidatesText = 'Никто не был выставлен';
  startNightText = 'Ночь';

  VoteResult = VoteResult;
  currentVoteResult = VoteResult.NO_CANDIDATES;

  constructor(
    private modalController: ModalController,
    private store: Store,
  ) {
    const vote = this.store.selectSnapshot(CurrentVoteState.getCurrentVote);
    const proposedPlayers = this.store.selectSnapshot(CurrentDayState.getProposedPlayers);
    const day = this.store.selectSnapshot(CurrentDayState.getDay);

    if (day.isVoteDisabled) {
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
