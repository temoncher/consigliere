import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';

import { RoundPhase } from '@/table/models/day-phase.enum';

import { VotePhase } from '../models/vote-phase.enum';
import { VoteResult } from '../models/vote-result.enum';
import { KillPlayer } from '../store/players/players.actions';
import { PlayersState } from '../store/players/players.state';
import { CurrentDayState } from '../store/round/current-day/current-day.state';
import {
  SetVotes,
  SetEliminateAllVote,
  SetPreviousLeadersIds,
  SetCurrentVotePhase,
  SetVoteResult,
  DisableCurrentVote,
} from '../store/round/current-vote/current-vote.actions';
import { CurrentVoteState } from '../store/round/current-vote/current-vote.state';
import { RoundState } from '../store/round/round.state';
import { SetIsNextVotingDisabled } from '../store/table.actions';
import { TableState } from '../store/table.state';

import { PlayersService } from './players.service';

@Injectable({
  providedIn: 'root',
})
export class VoteService {
  constructor(
    private store: Store,
    private playersService: PlayersService,
  ) { }

  startVote(proposedPlayers: string[]) {
    const votesSnapshot = this.store.selectSnapshot(CurrentVoteState.getVotes);
    const votes = [...votesSnapshot]; // to solve "object is not extensible" issue
    const isVoteDisabled = this.store.selectSnapshot(CurrentVoteState.getIsVoteDisabled);
    const roundNumber = this.store.selectSnapshot(TableState.getRoundNumber);
    const players = this.store.selectSnapshot(PlayersState.getPlayers);

    if ((proposedPlayers.length === 1 && roundNumber === 0) || !proposedPlayers.length || isVoteDisabled) {
      this.switchVotePhase(VotePhase.RESULT);

      return;
    }

    votes.push(new Map<string, string[]>());
    const vote = votes[votes.length - 1];

    if (proposedPlayers.length === 1) {
      const quitPhase = this.playersService.getQuitPhase();

      vote.set(proposedPlayers[0], players.map(({ user: { uid: id } }) => id));

      this.store.dispatch([
        new KillPlayer(proposedPlayers[0], quitPhase),
        new SetVotes(votes),
      ]);
      this.switchVotePhase(VotePhase.RESULT);

      return;
    }

    for (const candidateId of proposedPlayers) {
      vote.set(candidateId, []);
    }

    this.store.dispatch(new SetVotes(votes));
  }

  endVoteStage() {
    const previousLeadersIds = this.store.selectSnapshot(CurrentVoteState.getPreviousLeadersIds);
    const leadersIds = this.store.selectSnapshot(CurrentVoteState.getLeaders);

    if (!leadersIds.length) {
      throw new Error('Leader candidates not found');
    }

    if (leadersIds.length === 1) {
      const quitPhase = this.playersService.getQuitPhase();

      this.store.dispatch(new KillPlayer(leadersIds[0], quitPhase));
      this.switchVotePhase(VotePhase.RESULT);

      return;
    }

    if (previousLeadersIds?.length === leadersIds.length) {
      this.store.dispatch(new SetEliminateAllVote(new Map<string, boolean>()));
      this.switchVotePhase(VotePhase.ELIMINATE_VOTE);

      return;
    }

    this.switchVotePhase(VotePhase.SPEECH);
  }

  endEliminateVote() {
    const eliminateAllVote = this.store.selectSnapshot(CurrentVoteState.getEliminateVote);
    const leadersIds = this.store.selectSnapshot(CurrentVoteState.getLeaders);

    if (!leadersIds.length) {
      throw new Error('Leader candidates not found');
    }

    if (eliminateAllVote) {
      const alivePlayers = this.store.selectSnapshot(PlayersState.getAlivePlayers);
      const isEliminateAll = eliminateAllVote.size > alivePlayers.length / 2;

      if (isEliminateAll) {
        const quitPhase = this.playersService.getQuitPhase();

        for (const leaderId of leadersIds) {
          this.store.dispatch(new KillPlayer(leaderId, quitPhase));
        }
      }

      this.switchVotePhase(VotePhase.RESULT);

      return;
    }

    throw new Error('Eliminate vote is falsy');
  }

  endAdditionalSpeech() {
    const votesSnapshot = this.store.selectSnapshot(CurrentVoteState.getVotes);
    const votes = [...votesSnapshot];
    const leadersIds = this.store.selectSnapshot(CurrentVoteState.getLeaders);

    if (!leadersIds.length) {
      throw new Error('Leader candidates not found');
    }

    votes.push(new Map<string, string[]>());
    const vote = votes[votes.length - 1];

    for (const candidateId of leadersIds) {
      vote.set(candidateId, []);
    }

    this.store.dispatch([
      new SetVotes(votes),
      new SetPreviousLeadersIds(leadersIds),
    ]);

    this.switchVotePhase(VotePhase.VOTE);
  }

  switchVotePhase(newVotePhase: VotePhase) {
    const isVoteDisabled = this.store.selectSnapshot(CurrentVoteState.getIsVoteDisabled);
    const eliminateAllVote = this.store.selectSnapshot(CurrentVoteState.getEliminateVote);

    if (newVotePhase === VotePhase.RESULT) {
      const proposedPlayers = this.store.selectSnapshot(CurrentDayState.getProposedPlayers);
      const players = this.store.selectSnapshot(PlayersState.getPlayers);
      const currentRoundNumber = this.store.selectSnapshot(TableState.getRoundNumber);

      if (isVoteDisabled) {
        this.store.dispatch([
          new SetCurrentVotePhase(newVotePhase),
          new SetVoteResult(VoteResult.VOTE_IS_DISABLED),
        ]);

        return;
      }

      if (!proposedPlayers.size) {
        this.store.dispatch([
          new SetCurrentVotePhase(newVotePhase),
          new SetVoteResult(VoteResult.NO_CANDIDATES),
        ]);

        return;
      }

      if (proposedPlayers.size === 1 && currentRoundNumber === 0) {
        this.store.dispatch([
          new SetCurrentVotePhase(newVotePhase),
          new SetVoteResult(VoteResult.SINGLE_CANDIDATE_AND_ZERO_DAY),
        ]);

        return;
      }

      if (eliminateAllVote?.size <= players.length / 2) {
        this.store.dispatch([
          new SetCurrentVotePhase(newVotePhase),
          new SetVoteResult(VoteResult.PLAYERS_KEPT_ALIVE),
        ]);

        return;
      }

      this.store.dispatch([
        new SetCurrentVotePhase(newVotePhase),
        new SetVoteResult(VoteResult.PLAYERS_ELIMINATED),
      ]);

      return;
    }

    if (newVotePhase !== VotePhase.ELIMINATE_VOTE) {
      this.store.dispatch(new SetCurrentVotePhase(newVotePhase));

      return;
    }

    this.store.dispatch([
      new SetCurrentVotePhase(newVotePhase),
      new SetEliminateAllVote(new Map<string, false>()),
    ]);
  }

  disableVote() {
    const roundPhase = this.store.selectSnapshot(RoundState.getRoundPhase);
    const isResultClear = this.store.selectSnapshot(CurrentVoteState.isResultClear);

    if (roundPhase === RoundPhase.VOTE && isResultClear) {
      this.store.dispatch(new SetIsNextVotingDisabled(true));

      return;
    }

    this.store.dispatch(new DisableCurrentVote());
  }
}
