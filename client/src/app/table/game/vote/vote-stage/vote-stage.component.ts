import { Component, OnInit, OnDestroy } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SwiperOptions } from 'swiper';

import { defaultAvatarSrc } from '@/shared/constants/avatars';
import { Player } from '@/shared/models/player.model';
import { VoteService } from '@/table/services/vote.service';
import { PlayersState } from '@/table/store/players/players.state';
import { VoteForCandidate } from '@/table/store/round/current-vote/current-vote.actions';
import { CurrentVoteState } from '@/table/store/round/current-vote/current-vote.state';

import { IQuitPhase } from '~/types/interfaces/quit-phase.interface';

@Component({
  selector: 'app-vote-stage',
  templateUrl: './vote-stage.component.html',
  styleUrls: ['./vote-stage.component.scss'],
})
export class VoteStageComponent implements OnInit, OnDestroy {
  private destroy: Subject<boolean> = new Subject<boolean>();
  @Select(PlayersState.getPlayers) players$: Observable<Player[]>;
  @Select(CurrentVoteState.getCurrentVote) vote$: Observable<Record<string, string[]>>;
  @Select(PlayersState.getQuitPhases) quitPhases$: Observable<Record<string, IQuitPhase>>;

  defaultAvatar = defaultAvatarSrc;

  players: Player[];
  proposedPlayers: Player[] = [];
  vote: Record<string, string[]>;

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
    private voteService: VoteService,
  ) {
    const currentVote = this.store.selectSnapshot(CurrentVoteState.getCurrentVote);
    const alivePlayers = this.store.selectSnapshot(PlayersState.getAlivePlayers);
    const proposedPlayers: Player[] = [];

    // Implemented to keep players proposal order
    if (currentVote) {
      for (const candidateId of Object.keys(currentVote)) {
        const candidate = alivePlayers.find((player) => player.uid === candidateId);

        proposedPlayers.push(candidate);
      }
      this.proposedPlayers = proposedPlayers;
    }

    this.players$
      .pipe(takeUntil(this.destroy))
      .subscribe((newPlayers) => this.players = newPlayers);

    this.players$
      .pipe(takeUntil(this.destroy))
      .subscribe((newPlayers) => this.players = newPlayers);

    this.vote$
      .pipe(takeUntil(this.destroy))
      .subscribe((voteMap) => {
        this.vote = voteMap;
        // TODO: Rework mechanism to store real order of players proposal
        const newVoteInfoMap = new Map<string, Player>();
        let newNumberOfLeaderVotes = 0;

        if (voteMap) {
          for (const [candidateId, votedPlayersIds] of Object.entries(voteMap)) {
            const candidate = this.players.find((player) => player.uid === candidateId);

            if (votedPlayersIds.length > newNumberOfLeaderVotes) {
              newNumberOfLeaderVotes = votedPlayersIds.length;
            }

            for (const playerId of votedPlayersIds) {
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
    this.destroy.next();
    this.destroy.unsubscribe();
  }

  switchVote(playerId: string) {
    this.store.dispatch(new VoteForCandidate(playerId, this.proposedPlayers[this.currentPlayerIndex].uid));
  }

  next() {
    if (this.currentPlayerIndex + 1 < this.proposedPlayers.length) {
      this.currentPlayerIndex += 1;
    }
  }

  previous() {
    if (this.currentPlayerIndex > 0) {
      this.currentPlayerIndex -= 1;
    }
  }

  endVote() {
    this.voteService.endVoteStage();
  }

  navigateToPlayer(playerIndex: number) {
    this.currentPlayerIndex = playerIndex;
  }
}
