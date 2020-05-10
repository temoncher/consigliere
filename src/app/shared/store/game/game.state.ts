import { State, Action, StateContext, Selector, Store, NgxsOnInit } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { Navigate } from '@ngxs/router-plugin';
import { cloneDeep } from 'lodash';
import { StateReset } from 'ngxs-reset-plugin';

import { Round } from '@shared/models/table/round.model';
import { RoundPhase } from '@shared/models/table/day-phase.enum';
import { VotePhase } from '@shared/models/table/vote-phase.enum';
import { TimersService } from '@shared/services/timers.service';
import {
  StartNewRound,
  ResetIsNextVotingDisabled,
  DropGame,
  DisableVote,
  StartGame,
} from './game.actions';
import { PlayersState } from './players/players.state';
import { CurrentDayState } from './round/current-day/current-day.state';
import { ApplicationStateModel } from '..';
import { GameMenuState } from './menu/menu.state';
import { CurrentVoteState } from './round/current-vote/current-vote.state';
import { DisableCurrentVote } from './round/current-vote/current-vote.actions';
import { RoundState } from './round/round.state';
import { SetPlayersNumbers } from './players/players.actions';

export interface GameStateModel {
  rounds: Round[];
  isNextVotingDisabled: boolean;
  isGameStarted: boolean;
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
export class GameState implements NgxsOnInit {
  constructor(
    private timersService: TimersService,
    private store: Store,
  ) { }

  @Selector()
  static getRounds({ rounds }: GameStateModel) {
    return rounds;
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

  ngxsOnInit() {
    this.timersService.resetTimers();
  }

  @Action(StartGame)
  startGame({ dispatch, patchState }: StateContext<GameStateModel>) {
    dispatch([
      new SetPlayersNumbers(),
      new Navigate(['tabs', 'table', 'game']),
    ]);

    return patchState({ isGameStarted: true });
  }

  @Action(StartNewRound)
  startNewRound({ dispatch, patchState, getState }: StateContext<GameStateModel>) {
    const { rounds } = cloneDeep(getState());
    const roundSnapshot = this.store.selectSnapshot((state: ApplicationStateModel) => state.game.round);
    const currentDayNumber = this.store.selectSnapshot((state: ApplicationStateModel) => state.game.rounds).length;

    rounds.push(new Round({
      ...roundSnapshot.currentNight,
      ...roundSnapshot.currentDay,
      ...roundSnapshot.currentVote,
    }));
    this.timersService.resetTimers();

    dispatch([
      new StateReset(CurrentDayState),
      new Navigate(['tabs', 'table', 'game', currentDayNumber + 1, 'night']),
    ]);

    return patchState({ rounds });
  }

  @Action(ResetIsNextVotingDisabled)
  resetIsNextVotingDisabled({ patchState }: StateContext<GameStateModel>) {
    return patchState({ isNextVotingDisabled: false });
  }

  @Action(DisableVote)
  disableVote(
    { dispatch, patchState }: StateContext<GameStateModel>,
  ) {
    const roundPhase = this.store.selectSnapshot(RoundState.getRoundPhase);
    const isResultClear = this.store.selectSnapshot(CurrentVoteState.isResultClear);

    if (roundPhase === RoundPhase.VOTE && isResultClear) {
      return patchState({ isNextVotingDisabled: true });
    }

    return dispatch(new DisableCurrentVote());
  }

  @Action(DropGame)
  dropGame({ dispatch }: StateContext<GameStateModel>) {
    return dispatch([
      new StateReset(GameState),
      new Navigate(['tabs', 'table']),
    ]);
  }
}
