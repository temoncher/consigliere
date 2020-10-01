
import { Injectable } from '@angular/core';
import { State, Selector, StateContext, Action } from '@ngxs/store';

import { Player } from '@/shared/models/player.model';
import { VotePhase } from '@/table/models/vote-phase.enum';
import { IVote } from '@/table/models/vote.interface';

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

export interface CurrentVoteStateModel extends IVote {
  currentPhase?: VotePhase;
  previousLeadersIds?: string[];
}

@State<CurrentVoteStateModel>({
  name: 'currentVote',
  defaults: {
    isVoteDisabled: false,
    votes: [],
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

    for (const votedPlayersIds of Object.values(vote)) {
      if (votedPlayersIds.length > numberOfLeaderVotes) {
        numberOfLeaderVotes = votedPlayersIds.length;
      }
    }

    for (const [candidateId, votedPlayersIds] of Object.entries(vote)) {
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
      const votedPlayersIdsArrays = [...Object.values(currentVote)];

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
    const { eliminateAllVote } = getState();
    const newEliminateAllVote = { ...eliminateAllVote };
    const previousDecision = newEliminateAllVote[playerId];

    if (previousDecision) {
      delete newEliminateAllVote[playerId];
    } else {
      newEliminateAllVote[playerId] = true;
    }

    patchState({ eliminateAllVote: newEliminateAllVote });
  }

  @Action(VoteForCandidate)
  voteForCandidate(
    { patchState, getState }: StateContext<CurrentVoteStateModel>,
    {
      playerId,
      proposedPlayerId,
    }: VoteForCandidate,
  ) {
    const { votes } = getState();
    const newVotes = [...votes];
    const vote = newVotes[votes.length - 1];
    const isAlreadyVotedForThisPlayer = vote[proposedPlayerId].includes(playerId);

    if (isAlreadyVotedForThisPlayer) {
      vote[proposedPlayerId] = vote[proposedPlayerId].filter((votedPlayerId) => playerId !== votedPlayerId);

      patchState({ votes: newVotes });

      return;
    }

    for (const [candidateId, votedPlayers] of Object.entries(vote)) {
      const newVotedPlayers = votedPlayers.filter((votedPlayerId) => playerId !== votedPlayerId);

      vote[candidateId] = newVotedPlayers;
    }

    vote[proposedPlayerId].push(playerId);

    patchState({ votes: newVotes });
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
