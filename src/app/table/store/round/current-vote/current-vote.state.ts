
import { Injectable } from '@angular/core';
import { State, Selector, StateContext, Action } from '@ngxs/store';
import { cloneDeep } from 'lodash';

import { Player } from '@/shared/models/player.model';
import { VotePhase } from '@/table/models/vote-phase.enum';
import { VoteResult } from '@/table/models/vote-result.enum';
import { Vote } from '@/table/models/vote.interface';

import { PlayersState } from '../../players/players.state';

import {
  VoteForCandidate,
  DisableCurrentVote,
  SetPreviousLeadersIds,
  VoteForElimination,
  SetIsVoteDisabled,
  SetEliminateAllVote,
  SetVotes,
  SetCurrentVotePhase,
  SetVoteResult,
} from './current-vote.actions';

export interface CurrentVoteStateModel extends Vote {
  currentPhase?: VotePhase;
  previousLeadersIds?: string[];
}

@State<CurrentVoteStateModel>({
  name: 'currentVote',
  defaults: {
    isVoteDisabled: false,
    votes: [],
    voteResult: VoteResult.NO_CANDIDATES,
  },
})
@Injectable()
export class CurrentVoteState {
  // TODO: Refactor state to remove unnecessary getters
  @Selector()
  static getPhase({ currentPhase }: CurrentVoteStateModel) {
    return currentPhase;
  }

  @Selector()
  static getPreviousLeadersIds({ previousLeadersIds }: CurrentVoteStateModel) {
    return previousLeadersIds;
  }

  @Selector()
  static getIsVoteDisabled({ isVoteDisabled }: CurrentVoteStateModel) {
    return isVoteDisabled;
  }

  @Selector()
  static getVotes({ votes }: CurrentVoteStateModel) {
    return votes;
  }

  @Selector()
  static getCurrentVote({ votes }: CurrentVoteStateModel) {
    return votes[votes.length - 1];
  }

  @Selector()
  static getVoteResult({ voteResult }: CurrentVoteStateModel) {
    return voteResult;
  }

  @Selector()
  static getEliminateVote({ eliminateAllVote }: CurrentVoteStateModel) {
    return eliminateAllVote;
  }

  @Selector()
  static getLeaders({ votes }: CurrentVoteStateModel) {
    const vote = votes[votes.length - 1];
    const voteLeaders: string[] = [];
    let numberOfLeaderVotes = 0;

    for (const votedPlayersIds of vote.values()) {
      if (votedPlayersIds.length > numberOfLeaderVotes) {
        numberOfLeaderVotes = votedPlayersIds.length;
      }
    }

    for (const [candidateId, votedPlayersIds] of vote.entries()) {
      if (votedPlayersIds.length === numberOfLeaderVotes) {
        voteLeaders.push(candidateId);
      }
    }

    return voteLeaders;
  }

  @Selector([PlayersState.getAlivePlayers])
  static isResultClear(
    { votes, currentPhase }: CurrentVoteStateModel,
    alivePlayers: Player[],
  ) {
    if (!currentPhase || currentPhase === VotePhase.RESULT) {
      return true;
    }

    if (currentPhase === VotePhase.VOTE) {
      const currentVote = votes[votes.length - 1];
      const votedPlayersIdsArrays = [...currentVote.values()];

      return Boolean(votedPlayersIdsArrays.find((playersIds) => playersIds.length > alivePlayers.length / 2));
    }

    return false;
  }

  @Action(SetIsVoteDisabled)
  setIsVoteDisabled(
    { patchState }: StateContext<CurrentVoteStateModel>,
    { isVoteDisabled }: SetIsVoteDisabled,
  ) {
    patchState({ isVoteDisabled });
  }

  @Action(SetEliminateAllVote)
  setEliminateAllVote(
    { patchState }: StateContext<CurrentVoteStateModel>,
    { eliminateAllVote }: SetEliminateAllVote,
  ) {
    patchState({ eliminateAllVote });
  }

  @Action(VoteForElimination)
  voteForElimination(
    { patchState, getState }: StateContext<CurrentVoteStateModel>,
    { playerId }: VoteForElimination,
  ) {
    const { eliminateAllVote } = cloneDeep(getState());
    const previousDecision = eliminateAllVote.get(playerId);

    if (previousDecision) {
      eliminateAllVote.delete(playerId);
    } else {
      eliminateAllVote.set(playerId, true);
    }

    patchState({ eliminateAllVote });
  }

  @Action(VoteForCandidate)
  voteForCandidate(
    { patchState, getState }: StateContext<CurrentVoteStateModel>,
    {
      playerId,
      proposedPlayerId,
    }: VoteForCandidate,
  ) {
    const { votes } = cloneDeep(getState());
    const vote = votes[votes.length - 1];
    const isAlreadyVotedForThisPlayer = vote.get(proposedPlayerId).includes(playerId);

    if (isAlreadyVotedForThisPlayer) {
      vote.set(proposedPlayerId, vote.get(proposedPlayerId).filter((votedPlayerId) => playerId !== votedPlayerId));

      patchState({ votes });

      return;
    }

    for (const [candidateId, votedPlayers] of vote.entries()) {
      const newVotedPlayers = votedPlayers.filter((votedPlayerId) => playerId !== votedPlayerId);

      vote.set(candidateId, newVotedPlayers);
    }

    vote.get(proposedPlayerId).push(playerId);

    patchState({ votes });
  }

  @Action(SetVotes)
  setVotes(
    { patchState }: StateContext<CurrentVoteStateModel>,
    { votes }: SetVotes,
  ) {
    patchState({ votes });
  }

  @Action(DisableCurrentVote)
  disableCurrentVote({ patchState }: StateContext<CurrentVoteStateModel>) {
    patchState({ isVoteDisabled: true });
  }

  @Action(SetPreviousLeadersIds)
  SetPreviousLeadersIds(
    { patchState }: StateContext<CurrentVoteStateModel>,
    { previousLeadersIds }: SetPreviousLeadersIds,
  ) {
    patchState({ previousLeadersIds });
  }

  @Action(SetCurrentVotePhase)
  setCurrentVotePhase(
    { patchState }: StateContext<CurrentVoteStateModel>,
    { currentPhase }: SetCurrentVotePhase,
  ) {
    patchState({ currentPhase });
  }

  @Action(SetVoteResult)
  setVoteResult(
    { patchState }: StateContext<CurrentVoteStateModel>,
    { voteResult }: SetVoteResult,
  ) {
    patchState({ voteResult });
  }
}
