import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { PlayersState } from '@shared/store/table/players/players.state';
import { Observable } from 'rxjs';
import { Player } from '@shared/models/player.model';
import { CurrentDayState } from '@shared/store/table/current-day/current-day.state';
import { defaultAvatarSrc } from '@shared/constants/avatars';
import { VoteForCandidate } from '@shared/store/table/current-day/current-day.actions';

@Component({
  selector: 'app-vote-stage',
  templateUrl: './vote-stage.component.html',
  styleUrls: ['./vote-stage.component.scss'],
})
export class VoteStageComponent implements OnInit {
  @Select(PlayersState.getPlayers) players$: Observable<Player[]>;
  @Select(CurrentDayState.getCurrentVote) vote$: Observable<Map<string, string[]>>;

  defaultAvatar = defaultAvatarSrc;

  players: Player[];
  proposedPlayers: Player[];
  vote: Map<string, string[]>;

  numberSliderConfig = {};
  currentPlayerIndex = 0;

  constructor(
    private store: Store,
  ) {
    this.players$.subscribe((players) => this.players = players);
    this.vote$.subscribe((voteMap) => {
      // TODO: Rework mechanism to store real order of players proposal
      const proposedPlayers = [];

      if (voteMap) {
        for (const candidateId of voteMap.keys()) {
          const candidate = this.players.find((player) => player.user.id === candidateId);

          if (candidate) {
            proposedPlayers.push(candidate);
          }
        }
      }

      this.proposedPlayers = proposedPlayers;
      this.vote = voteMap;
    });

    if (this.proposedPlayers?.length) {
      this.currentPlayerIndex = this.proposedPlayers[0].number - 1;
    }
  }

  ngOnInit() {
    setTimeout(() => {
      // TODO: Remove crutch for slider config update
      this.numberSliderConfig = {
        slidesPerView: 5.5,
        centeredSlides: true,
      };
    }, 0);
  }

  switchVote(playerId: string) {
    this.store.dispatch(new VoteForCandidate(playerId, this.players[this.currentPlayerIndex].user.id));
  }

  voteCandidateId(playerId: string) {
    let voteCandidateId = '';

    for (const [candidateId, votedPlayersIds] of this.vote.entries()) {
      if (votedPlayersIds.includes(playerId)) {
        voteCandidateId = candidateId;
      }
    }

    return voteCandidateId;
  }

  isAlreadyVotedForAnotherPlayer(playerId: string) {
    let isAlreadyVoted = false;

    for (const [candidateId, votedPlayersIds] of this.vote.entries()) {
      if (candidateId !== this.players[this.currentPlayerIndex].user.id && votedPlayersIds.includes(playerId)) {
        isAlreadyVoted = true;
      }
    }

    return isAlreadyVoted;
  }

  previousPlayer() { }
  nextPlayer() { }

  navigateToPlayer(playerNumber: number) {
    this.currentPlayerIndex = playerNumber - 1;
  }
}
