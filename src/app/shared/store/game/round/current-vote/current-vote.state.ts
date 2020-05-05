import { State, Selector, StateContext, Action, Store, NgxsOnInit } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';

import { VotePhase } from '@shared/models/table/vote-phase.enum';
import { Player } from '@shared/models/player.model';
import { ApplicationStateModel } from '@shared/store';
import { VoteForCandidate, StartVote, EndVoteStage, SwitchVotePhase, DisableCurrentVote, EndVote } from './current-vote.actions';
import { KillPlayer } from '../../players/players.actions';
import { PlayersState } from '../../players/players.state';
import { Vote } from '@shared/models/table/vote.interface';

export interface CurrentVoteStateModel extends Vote {
  currentPhase?: VotePhase;
}

@State<CurrentVoteStateModel>({
  name: 'currentVote',
  defaults: {
    isVoteDisabled: false,
  },
})
@Injectable()
export class CurrentVoteState implements NgxsOnInit {
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

  ngxsOnInit({ patchState }: StateContext<CurrentVoteStateModel>) {
    const isVoteDisabled = this.store.selectSnapshot((state: ApplicationStateModel) => state.game.isNextVotingDisabled);

    return patchState({ isVoteDisabled });
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
    const { votes } = cloneDeep(getState());

    votes.push(new Map<string, string[]>());
    const vote = votes[votes.length - 1];

    if (proposedPlayers.length === 1) {
      const players = this.store.selectSnapshot((state: ApplicationStateModel) => state.game.players.players);
      vote.set(proposedPlayers[0], players.map(({ user: { id } }) => id));

      dispatch(new SwitchVotePhase(VotePhase.RESULT));
      return patchState({ votes });
    }

    for (const candidateId of proposedPlayers) {
      vote.set(candidateId, []);
    }

    if (votes.length > 1) {
      dispatch(new SwitchVotePhase(VotePhase.SPEECH));
    }

    return patchState({ votes });
  }

  @Action(DisableCurrentVote)
  disableCurrentVote({ patchState }: StateContext<CurrentVoteStateModel>) {
    return patchState({ isVoteDisabled: true });
  }

  @Action(EndVoteStage)
  endVoteStage(
    { dispatch, getState }: StateContext<CurrentVoteStateModel>,
    { leadersIds }: EndVoteStage,
  ) {
    const { eliminateAllVote } = cloneDeep(getState());

    if (!leadersIds?.length) {
      throw new Error('Leader candidates not found');
    }

    if (leadersIds.length === 1) {
      dispatch(new KillPlayer(leadersIds[0]));

      return dispatch(new SwitchVotePhase(VotePhase.RESULT));
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

    return dispatch(new SwitchVotePhase(VotePhase.ELIMINATE_VOTE));
  }

  @Action(SwitchVotePhase)
  switchVotePhase(
    { patchState, getState }: StateContext<CurrentVoteStateModel>,
    { newVotePhase }: SwitchVotePhase,
  ) {
    let { eliminateAllVote } = cloneDeep(getState());

    switch (newVotePhase) {
      case VotePhase.ELIMINATE_VOTE:
        eliminateAllVote = new Map<string, false>();
        break;
      case VotePhase.SPEECH:
        // TODO: IMPLEMENT TIMERS SERVICE HANDLE
        break;
      default:
        break;
    }
    return patchState({ eliminateAllVote, currentPhase: newVotePhase });
  }

  @Action(EndVote)
  endVote(
    { }: StateContext<CurrentVoteStateModel>,
  ) {
    throw new Error('Not implemented yet');
  }
}
