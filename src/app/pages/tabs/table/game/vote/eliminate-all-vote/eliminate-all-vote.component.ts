import { Component, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';

import { VoteForElimination } from '@shared/store/game/round/current-vote/current-vote.actions';
import { PlayersState } from '@shared/store/game/players/players.state';
import { QuitPhase } from '@shared/models/quit-phase.interface';
import { Player } from '@shared/models/player.model';
import { CurrentVoteState } from '@shared/store/game/round/current-vote/current-vote.state';
import { VoteService } from '@shared/services/vote.service';

@Component({
  selector: 'app-eliminate-all-vote',
  templateUrl: './eliminate-all-vote.component.html',
  styleUrls: ['./eliminate-all-vote.component.scss'],
})
export class EliminateAllVoteComponent implements OnInit {
  @Select(CurrentVoteState.getEliminateVote) eliminateAllVote$: Observable<Map<string, boolean>>;
  @Select(PlayersState.getQuitPhases) quitPhases$: Observable<Map<string, QuitPhase>>;
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
