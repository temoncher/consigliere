import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { CurrentDayState, CurrentDayStateModel } from '@shared/store/game/current-day/current-day.state';
import { Observable } from 'rxjs';
import { CurrentVoteState } from '@shared/store/game/current-day/current-vote/current-vote.state';
import { VotePhase } from '@shared/models/table/vote-phase.enum';

@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.scss'],
})
export class VoteComponent implements OnInit {
  @Select(CurrentVoteState.getPhase) votePhase$: Observable<VotePhase>;

  VotePhase = VotePhase;

  constructor() { }

  ngOnInit() { }
}
