import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { RoundPhase } from '@shared/models/table/day-phase.enum';
import { GameResult } from '@shared/models/table/game-result.enum';
import { Round } from '@shared/models/table/round.model';
import { VotePhase } from '@shared/models/table/vote-phase.enum';
import { cloneDeep } from 'lodash';

import {
  ResetIsNextVotingDisabled,
  SetIsNextVotingDisabled,
  SetIsGameStarted,
  EndGame,
  AddRound,
} from './game.actions';
import { GameMenuState } from './menu/game-menu.state';
import { PlayersState } from './players/players.state';
import { CurrentVoteState } from './round/current-vote/current-vote.state';
import { RoundState } from './round/round.state';

export interface GameStateModel {
  rounds: Round[];
  isNextVotingDisabled: boolean;
  isGameStarted: boolean;
  gameResult?: GameResult;
}

@State<GameStateModel>({
  name: 'game',
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
export class GameState {
  @Selector()
  static getRounds({ rounds }: GameStateModel) {
    return rounds;
  }

  @Selector()
  static getIsNextVotingDisabled({ isNextVotingDisabled }: GameStateModel) {
    return isNextVotingDisabled;
  }

  @Selector()
  static getIsGameStarted({ isGameStarted }: GameStateModel) {
    return isGameStarted;
  }

  @Selector([RoundState.getRoundPhase, CurrentVoteState.getPhase])
  static getCurrentGameStage(
    { rounds }: GameStateModel,
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
  static getRoundNumber(state: GameStateModel) {
    return state.rounds.length;
  }

  @Selector()
  static getGameResult({ gameResult }: GameStateModel) {
    return gameResult;
  }

  @Action(SetIsGameStarted)
  startGame(
    { patchState }: StateContext<GameStateModel>,
    { isGameStarted }: SetIsGameStarted,
  ) {
    patchState({ isGameStarted });
  }

  @Action(AddRound)
  addRound(
    { patchState, getState }: StateContext<GameStateModel>,
    { round }: AddRound,
  ) {
    const { rounds } = cloneDeep(getState());

    rounds.push(round);

    patchState({ rounds });
  }

  @Action(ResetIsNextVotingDisabled)
  resetIsNextVotingDisabled({ patchState }: StateContext<GameStateModel>) {
    patchState({ isNextVotingDisabled: false });
  }

  @Action(SetIsNextVotingDisabled)
  setIsNextVotingDisabled(
    { patchState }: StateContext<GameStateModel>,
    { isNextVotingDisabled }: SetIsNextVotingDisabled,
  ) {
    patchState({ isNextVotingDisabled });
  }

  @Action(EndGame)
  endGame(
    { patchState }: StateContext<GameStateModel>,
    { gameResult }: EndGame,
  ) {
    patchState({ gameResult });
  }
}
