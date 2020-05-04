import { Component, OnInit, OnDestroy } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { PlayersState } from '@shared/store/game/players/players.state';
import { Observable, Subject } from 'rxjs';
import { Player } from '@shared/models/player.model';
import { defaultAvatarSrc } from '@shared/constants/avatars';
import { takeUntil } from 'rxjs/operators';
import { VoteForCandidate, EndVoteStage, StartVote } from '@shared/store/game/current-day/current-vote/current-vote.actions';
import { CurrentVoteState } from '@shared/store/game/current-day/current-vote/current-vote.state';
import { SwiperOptions } from 'swiper';

@Component({
  selector: 'app-vote-stage',
  templateUrl: './vote-stage.component.html',
  styleUrls: ['./vote-stage.component.scss'],
})
export class VoteStageComponent implements OnInit, OnDestroy {
  private destory: Subject<boolean> = new Subject<boolean>();
  @Select(PlayersState.getPlayers) players$: Observable<Player[]>;
  @Select(CurrentVoteState.getCurrentVote) vote$: Observable<Map<string, string[]>>;

  defaultAvatar = defaultAvatarSrc;

  players: Player[];
  proposedPlayers: Player[];
  vote: Map<string, string[]>;

  voteInfoMap: Map<string, Player> = new Map<string, Player>();
  numberSliderConfig: SwiperOptions = {
    slidesPerView: 5.5,
    centeredSlides: true,
  };
  currentPlayerIndex = 0;
  numberOfLeaderVotes = 0;
  numberOfPreviousVoteLeaders = 0;
  isAllPlayersVoted = false;

  constructor(
    private store: Store,
  ) {
    const currentVote = this.store.selectSnapshot(CurrentVoteState.getCurrentVote);
    const alivePlayers = this.store.selectSnapshot(PlayersState.getAlivePlayers);
    const proposedPlayers: Player[] = [];
    // Implemented to keep players proposal order
    for (const candidateId of currentVote.keys()) {
      const candidate = alivePlayers.find((player) => player.user.id === candidateId);

      proposedPlayers.push(candidate);
    }
    this.proposedPlayers = proposedPlayers;

    this.players$
      .pipe(takeUntil(this.destory))
      .subscribe((newPlayers) => this.players = newPlayers);
    this.vote$
      .pipe(takeUntil(this.destory))
      .subscribe((voteMap) => {
        this.vote = voteMap;
        // TODO: Rework mechanism to store real order of players proposal
        const newVoteInfoMap = new Map<string, Player>();
        let newNumberOfLeaderVotes = 0;

        if (voteMap) {
          for (const candidateId of voteMap.keys()) {
            const candidate = this.players.find((player) => player.user.id === candidateId);

            if (voteMap.get(candidateId).length > newNumberOfLeaderVotes) {
              newNumberOfLeaderVotes = voteMap.get(candidateId).length;
            }

            for (const playerId of voteMap.get(candidateId)) {
              newVoteInfoMap.set(playerId, candidate);
            }
          }
        }

        this.isAllPlayersVoted = alivePlayers.length === newVoteInfoMap.size;
        this.voteInfoMap = newVoteInfoMap;
        this.numberOfLeaderVotes = newNumberOfLeaderVotes;
      });
  }

  ngOnInit() { }

  ngOnDestroy() {
    this.destory.next();
    this.destory.unsubscribe();
  }

  switchVote(playerId: string) {
    this.store.dispatch(new VoteForCandidate(playerId, this.proposedPlayers[this.currentPlayerIndex].user.id));
  }

  next() {
    if (this.currentPlayerIndex + 1 < this.proposedPlayers.length) {
      this.currentPlayerIndex++;
    }
  }

  previous() {
    if (this.currentPlayerIndex > 0) {
      this.currentPlayerIndex--;
    }
  }

  endVote() {
    const voteLeaders = [];
    for (const [candidateId, votedPlayersIds] of this.vote.entries()) {
      if (votedPlayersIds.length === this.numberOfLeaderVotes) {
        voteLeaders.push(candidateId);
      }
    }

    if (voteLeaders.length === 1) {
      this.store.dispatch(new EndVoteStage(voteLeaders));
      return;
    }

    this.store.dispatch(new StartVote(voteLeaders));
  }

  navigateToPlayer(playerIndex: number) {
    this.currentPlayerIndex = playerIndex;
  }
}