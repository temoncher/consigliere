import { State, Selector, StateContext, Action, Store } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';

import { VotePhase } from '@shared/models/table/vote-phase.enum';
import { Player } from '@shared/models/player.model';
import { ApplicationStateModel } from '@shared/store';
import { VoteResult } from '@shared/models/table/vote-result.enum';
import { Vote } from '@shared/models/table/vote.interface';
import {
  VoteForCandidate,
  StartVote,
  EndVoteStage,
  SwitchVotePhase,
  DisableCurrentVote,
  EndVote,
  EndEliminateVote,
  EndAdditionalSpeech,
  VoteForEliminateAll,
  SetIsVoteDisabled,
  SwitchVoteResult,
} from './current-vote.actions';
import { KillPlayer } from '../../players/players.actions';
import { PlayersState } from '../../players/players.state';
import { StartNewRound } from '../../game.actions';

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
  constructor(
    private store: Store,
  ) { }

  @Selector()
  static getPhase({ currentPhase }: CurrentVoteStateModel) {
    return currentPhase;
  }

  @Selector()
  static getIsVoteDisabled({ isVoteDisabled }: CurrentVoteStateModel) {
    return isVoteDisabled;
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
  setIsVoteDisabled({ patchState }: StateContext<CurrentVoteStateModel>) {
    const isVoteDisabled = this.store.selectSnapshot((state: ApplicationStateModel) => state.game.isNextVotingDisabled);

    return patchState({ isVoteDisabled });
  }

  @Action(VoteForEliminateAll)
  voteForEliminateAll(
    { patchState, getState }: StateContext<CurrentVoteStateModel>,
    { playerId }: VoteForEliminateAll,
  ) {
    const { eliminateAllVote } = cloneDeep(getState());
    const previousDecision = eliminateAllVote.get(playerId);

    if (previousDecision) {
      eliminateAllVote.delete(playerId);
    } else {
      eliminateAllVote.set(playerId, previousDecision);
    }

    return patchState({ eliminateAllVote });
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

      return patchState({ votes });
    }

    for (const [candidateId, votedPlayers] of vote.entries()) {
      const newVotedPlayers = votedPlayers.filter((votedPlayerId) => playerId !== votedPlayerId);
      vote.set(candidateId, newVotedPlayers);
    }

    vote.get(proposedPlayerId).push(playerId);

    return patchState({ votes });
  }

  @Action(StartVote)
  startVote(
    { dispatch, patchState, getState }: StateContext<CurrentVoteStateModel>,
    { proposedPlayers }: StartVote,
  ) {
    const { votes, isVoteDisabled } = cloneDeep(getState());
    const { rounds, players: { players } } = this.store.selectSnapshot(({ game }: ApplicationStateModel) => game);
    const currentRoundNumber = rounds.length;

    if (proposedPlayers.length === 1 && currentRoundNumber === 0 || !proposedPlayers.length || isVoteDisabled) {
      return dispatch(new SwitchVotePhase(VotePhase.RESULT));
    }

    votes.push(new Map<string, string[]>());
    const vote = votes[votes.length - 1];

    if (proposedPlayers.length === 1) {
      vote.set(proposedPlayers[0], players.map(({ user: { id } }) => id));

      dispatch([
        new KillPlayer(proposedPlayers[0]),
        new SwitchVotePhase(VotePhase.RESULT),
      ]);
      return patchState({ votes });
    }

    for (const candidateId of proposedPlayers) {
      vote.set(candidateId, []);
    }

    return patchState({ votes });
  }

  @Action(DisableCurrentVote)
  disableCurrentVote({ patchState }: StateContext<CurrentVoteStateModel>) {
    return patchState({ isVoteDisabled: true });
  }

  @Action(EndAdditionalSpeech)
  endAdditionalSpeech({ dispatch, patchState, getState }: StateContext<CurrentVoteStateModel>) {
    const { votes } = cloneDeep(getState());
    const leadersIds = this.store.selectSnapshot(CurrentVoteState.getLeaders);

    if (!leadersIds.length) {
      throw new Error('Leader candidates not found');
    }

    votes.push(new Map<string, string[]>());
    const vote = votes[votes.length - 1];

    for (const candidateId of leadersIds) {
      vote.set(candidateId, []);
    }

    patchState({ votes, previousLeadersIds: leadersIds });
    return dispatch(new SwitchVotePhase(VotePhase.VOTE));
  }

  @Action(EndVoteStage)
  endVoteStage({ dispatch, patchState, getState }: StateContext<CurrentVoteStateModel>) {
    const { previousLeadersIds } = cloneDeep(getState());
    const leadersIds = this.store.selectSnapshot(CurrentVoteState.getLeaders);

    if (!leadersIds.length) {
      throw new Error('Leader candidates not found');
    }

    if (leadersIds.length === 1) {
      dispatch(new KillPlayer(leadersIds[0]));

      return dispatch(new SwitchVotePhase(VotePhase.RESULT));
    }

    if (previousLeadersIds?.length === leadersIds.length) {
      patchState({ eliminateAllVote: new Map<string, boolean>() });
      return dispatch(new SwitchVotePhase(VotePhase.ELIMINATE_VOTE));
    }

    return dispatch(new SwitchVotePhase(VotePhase.SPEECH));
  }

  @Action(EndEliminateVote)
  endEliminateVote({ dispatch, getState }: StateContext<CurrentVoteStateModel>) {
    const { eliminateAllVote } = cloneDeep(getState());
    const leadersIds = this.store.selectSnapshot(CurrentVoteState.getLeaders);

    if (!leadersIds.length) {
      throw new Error('Leader candidates not found');
    }

    if (eliminateAllVote) {
      const alivePlayers = this.store.selectSnapshot(PlayersState.getAlivePlayers);
      const isEliminateAll = eliminateAllVote.size > alivePlayers.length / 2;

      if (isEliminateAll) {
        for (const leaderId of leadersIds) {
          dispatch(new KillPlayer(leaderId));
        }
      }

      return dispatch(new SwitchVotePhase(VotePhase.RESULT));
    }

    throw new Error('Eliminate vote is falsy');
  }

  @Action(SwitchVotePhase)
  switchVotePhase(
    { patchState, getState }: StateContext<CurrentVoteStateModel>,
    { newVotePhase }: SwitchVotePhase,
  ) {
    const { isVoteDisabled, eliminateAllVote } = cloneDeep(getState());

    if (newVotePhase === VotePhase.RESULT) {
      const proposedPlayers = this.store.selectSnapshot(({ game }: ApplicationStateModel) => game.round.currentDay.proposedPlayers);
      const players = this.store.selectSnapshot(({ game }: ApplicationStateModel) => game.players.players);
      const currentRoundNumber = this.store.selectSnapshot(({ game }: ApplicationStateModel) => game.rounds).length;

      if (isVoteDisabled) {
        return patchState({
          currentPhase: newVotePhase,
          voteResult: VoteResult.VOTE_IS_DISABLED,
        });
      }

      if (!proposedPlayers.size) {
        return patchState({
          currentPhase: newVotePhase,
          voteResult: VoteResult.NO_CANDIDATES,
        });
      }

      if (proposedPlayers.size === 1 && currentRoundNumber === 0) {
        return patchState({
          currentPhase: newVotePhase,
          voteResult: VoteResult.SINGLE_CANDIDATE_AND_ZERO_DAY,
        });
      }

      if (eliminateAllVote?.size <= players.length / 2) {
        return patchState({
          currentPhase: newVotePhase,
          voteResult: VoteResult.PLAYERS_KEPT_ALIVE,
        });
      }

      return patchState({
        currentPhase: newVotePhase,
        voteResult: VoteResult.PLAYERS_ELIMINATED,
      });
    }

    if (newVotePhase !== VotePhase.ELIMINATE_VOTE) {
      return patchState({ currentPhase: newVotePhase });
    }

    return patchState({
      eliminateAllVote: new Map<string, false>(),
      currentPhase: newVotePhase,
    });
  }

  @Action(SwitchVoteResult)
  switchVoteResult(
    { patchState }: StateContext<CurrentVoteStateModel>,
    { voteResult }: SwitchVoteResult,
  ) {
    return patchState({ voteResult });
  }

  @Action(EndVote)
  endVote(
    { dispatch }: StateContext<CurrentVoteStateModel>,
  ) {
    dispatch([
      new StartNewRound(),
    ]);
  }
}
