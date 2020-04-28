import { State, Selector, StateContext, Action, Store } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { TimersService } from '@shared/services/timers.service';
import { cloneDeep } from 'lodash';

import { VotePhase } from '@shared/models/table/vote-phase.enum';
import { Vote } from '@shared/models/table/vote.model';
import { VoteStage } from '@shared/models/table/vote-stage.model';
import { Player } from '@shared/models/player.model';
import { ApplicationStateModel } from '@shared/store';
import { VoteForCandidate, StartVote, EndVoteStage, SwitchVotePhase } from './current-vote.actions';
import { KillPlayer } from '../../players/players.actions';
import { PlayersState } from '../../players/players.state';


export interface CurrentVoteStateModel extends Partial<Vote> {
  currentPhase?: VotePhase;
}

@State<CurrentVoteStateModel>({
  name: 'currentVote',
  defaults: {
    stages: [],
  },
})
@Injectable()
export class CurrentVoteState {
  constructor(
    private store: Store,
    private timersService: TimersService,
  ) { }

  @Selector()
  static getPhase(state: CurrentVoteStateModel) {
    return state.currentPhase;
  }

  @Selector([PlayersState.getAlivePlayers])
  static isResultClear(
    { stages, currentPhase }: CurrentVoteStateModel,
    alivePlayers: Player[],
  ) {
    if (!currentPhase) {
      return true;
    }

    if (currentPhase === VotePhase.RESULT) {
      return true;
    }

    if (currentPhase === VotePhase.VOTE) {
      const currentVote = stages[stages.length - 1].votes;
      const votedPlayersIdsArrays = [...currentVote.values()];

      return Boolean(votedPlayersIdsArrays.find((playersIds) => playersIds.length > alivePlayers.length / 2));
    }

    return false;
  }

  @Selector()
  static getVoteObject(state: CurrentVoteStateModel) {
    return state;
  }

  @Selector()
  static getCurrentVote({ stages }: CurrentVoteStateModel) {
    return stages[stages.length - 1].votes;
  }

  @Action(VoteForCandidate)
  voteForCandidate(
    { patchState, getState }: StateContext<CurrentVoteStateModel>,
    {
      playerId,
      proposedPlayerId,
    }: VoteForCandidate,
  ) {
    const { stages } = cloneDeep(getState());
    const votes = stages[stages.length - 1].votes;
    const isAlreadyVotedForThisPlayer = votes.get(proposedPlayerId).includes(playerId);

    if (isAlreadyVotedForThisPlayer) {
      votes.set(proposedPlayerId, votes.get(proposedPlayerId).filter((votedPlayerId) => playerId !== votedPlayerId));

      return patchState({ stages });
    }

    for (const [candidateId, votedPlayers] of votes.entries()) {
      const newVotedPlayers = votedPlayers.filter((votedPlayerId) => playerId !== votedPlayerId);
      votes.set(candidateId, newVotedPlayers);
    }

    votes.get(proposedPlayerId).push(playerId);

    return patchState({ stages });
  }

  @Action(StartVote)
  startVote(
    { dispatch, patchState, getState }: StateContext<CurrentVoteStateModel>,
    { proposedPlayers }: StartVote,
  ) {
    const { stages } = cloneDeep(getState());

    stages.push(new VoteStage());
    const votes = stages[stages.length - 1].votes;

    if (proposedPlayers.length === 1) {
      const players = this.store.selectSnapshot((state: ApplicationStateModel) => state.game.players.players);
      votes.set(proposedPlayers[0], players.map(({ user: { id } }) => id));

      dispatch(new SwitchVotePhase(VotePhase.RESULT));
      return patchState({ stages });
    }

    for (const candidateId of proposedPlayers) {
      votes.set(candidateId, []);
    }

    if (stages.length > 1) {
      dispatch(new SwitchVotePhase(VotePhase.SPEECH));
    }

    return patchState({ stages });
  }

  @Action(EndVoteStage)
  endVoteStage(
    { dispatch, getState }: StateContext<CurrentVoteStateModel>,
    { leadersIds }: EndVoteStage,
  ) {
    const { eliminateAllVote } = cloneDeep(getState());
    this.timersService.resetTimers();

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
}
