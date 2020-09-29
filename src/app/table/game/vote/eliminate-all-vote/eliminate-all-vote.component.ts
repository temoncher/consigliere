import { Component, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';

import { Player } from '@/shared/models/player.model';
import { QuitPhase } from '@/shared/models/quit-phase.interface';
import { VoteService } from '@/table/services/vote.service';
import { PlayersState } from '@/table/store/players/players.state';
import { VoteForElimination } from '@/table/store/round/current-vote/current-vote.actions';
import { CurrentVoteState } from '@/table/store/round/current-vote/current-vote.state';

@Component({
  selector: 'app-eliminate-all-vote',
  templateUrl: './eliminate-all-vote.component.html',
  styleUrls: ['./eliminate-all-vote.component.scss'],
})
export class EliminateAllVoteComponent implements OnInit {
  @Select(CurrentVoteState.getEliminateVote) eliminateAllVote$: Observable<Map<string, boolean>>;
  @Select(PlayersState.getQuitPhases) quitPhases$: Observable<Record<string, QuitPhase>>;
  @Select(PlayersState.getPlayers) players$: Observable<Player[]>;

  constructor(
    private store: Store,
    private voteService: VoteService,
  ) { }

  ngOnInit() { }

  switchVote(playerId: string) {
    this.store.dispatch(new VoteForElimination(playerId));
  }

  endEliminateVote() {
    this.voteService.endEliminateVote();
  }
}
