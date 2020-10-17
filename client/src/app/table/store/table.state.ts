import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';

import { GameResult } from '@/graphql/gql.generated';
import { VotePhase } from '@/table/models/vote-phase.enum';

import { IRound } from '../models/round.interface';

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

import { RoundPhase } from '~types/enums/round-phase.enum';

export interface TableStateModel {
  rounds: IRound[];
  club?: string;
  isNextVotingDisabled: boolean;
  isGameStarted: boolean;
  gameResult?: GameResult;
}

@State<TableStateModel>({
  name: 'table',
  defaults: {
    rounds: [],
    club: 'Wk1xFuaxxoP28m6NquGi', // TODO: collect data from user
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
  static getClub({ club }: TableStateModel) {
    return club;
  }

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
    const { rounds } = getState();
    const newRounds = [...rounds];

    newRounds.push(round);

    patchState({ rounds: newRounds });
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
