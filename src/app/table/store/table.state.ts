import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { cloneDeep } from 'lodash';

import { RoundPhase } from '@/table/models/day-phase.enum';
import { GameResult } from '@/table/models/game-result.enum';
import { Round } from '@/table/models/round.model';
import { VotePhase } from '@/table/models/vote-phase.enum';

import { GameMenuState } from './menu/game-menu.state';
import { PlayersState } from './players/players.state';
import { CurrentVoteState } from './round/current-vote/current-vote.state';
import { RoundState } from './round/round.state';
import {
  ResetIsNextVotingDisabled,
  SetIsNextVotingDisabled,
  SetIsGameStarted,
  EndGame,
  AddRound,
} from './table.actions';

export interface TableStateModel {
  rounds: Round[];
  isNextVotingDisabled: boolean;
  isGameStarted: boolean;
  gameResult?: GameResult;
}

@State<TableStateModel>({
  name: 'table',
  defaults: {
    rounds: [],
    isNextVotingDisabled: false,
    isGameStarted: false,
  },
  children: [
    PlayersState,
    GameMenuState,
    RoundState,
  ],
})
@Injectable()
export class TableState {
  @Selector()
  static getRounds({ rounds }: TableStateModel) {
    return rounds;
  }

  @Selector()
  static getIsNextVotingDisabled({ isNextVotingDisabled }: TableStateModel) {
    return isNextVotingDisabled;
  }

  @Selector()
  static getIsGameStarted({ isGameStarted }: TableStateModel) {
    return isGameStarted;
  }

  @Selector([RoundState.getRoundPhase, CurrentVoteState.getPhase])
  static getCurrentGameStage(
    { rounds }: TableStateModel,
    roundPhase: RoundPhase,
    votePhase: VotePhase,
  ) {
    const roundNumber = rounds.length;

    return {
      roundNumber,
      roundPhase,
      votePhase,
    };
  }

  @Selector()
  static getRoundNumber(state: TableStateModel) {
    return state.rounds.length;
  }

  @Selector()
  static getGameResult({ gameResult }: TableStateModel) {
    return gameResult;
  }

  @Action(SetIsGameStarted)
  startGame(
    { patchState }: StateContext<TableStateModel>,
    { isGameStarted }: SetIsGameStarted,
  ) {
    patchState({ isGameStarted });
  }

  @Action(AddRound)
  addRound(
    { patchState, getState }: StateContext<TableStateModel>,
    { round }: AddRound,
  ) {
    const { rounds } = cloneDeep(getState());

    rounds.push(round);

    patchState({ rounds });
  }

  @Action(ResetIsNextVotingDisabled)
  resetIsNextVotingDisabled({ patchState }: StateContext<TableStateModel>) {
    patchState({ isNextVotingDisabled: false });
  }

  @Action(SetIsNextVotingDisabled)
  setIsNextVotingDisabled(
    { patchState }: StateContext<TableStateModel>,
    { isNextVotingDisabled }: SetIsNextVotingDisabled,
  ) {
    patchState({ isNextVotingDisabled });
  }

  @Action(EndGame)
  endGame(
    { patchState }: StateContext<TableStateModel>,
    { gameResult }: EndGame,
  ) {
    patchState({ gameResult });
  }
}
