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
  CheckGameEndingConditions,
  EndGame,
} from './game.actions';
import { PlayersState } from './players/players.state';
import { ApplicationStateModel } from '..';
import { GameMenuState } from './menu/menu.state';
import { CurrentVoteState } from './round/current-vote/current-vote.state';
import { DisableCurrentVote } from './round/current-vote/current-vote.actions';
import { RoundState } from './round/round.state';
import { SetPlayersNumbers, GiveRoles } from './players/players.actions';
import { SwitchRoundPhase } from './round/round.actions';
import { Role } from '@shared/models/role.enum';
import { GameResult } from '@shared/models/table/game-result.enum';

export interface GameStateModel {
  rounds: Round[];
  isNextVotingDisabled: boolean;
  isGameStarted: boolean;
  gameResult: GameResult;
}

@State<GameStateModel>({
  name: 'game',
  defaults: {
    rounds: [],
    isNextVotingDisabled: false,
    isGameStarted: false,
    gameResult: undefined,
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

  @Selector()
  static getGameResult({ gameResult }: GameStateModel) {
    return gameResult;
  }

  ngxsOnInit() {
    this.timersService.resetTimers();
  }

  @Action(StartGame)
  startGame({ dispatch, patchState }: StateContext<GameStateModel>) {
    dispatch([
      new SetPlayersNumbers(),
      new GiveRoles(),
      new Navigate(['tabs', 'table', 'game']),
    ]);

    patchState({ isGameStarted: true });
  }

  @Action(CheckGameEndingConditions)
  checkGameEndingConditions({ dispatch, patchState }: StateContext<GameStateModel>) {
    const alivePlayers = this.store.selectSnapshot(PlayersState.getAlivePlayers);
    const mafiaPlayers = this.store.selectSnapshot(PlayersState.getPlayersByRoles([Role.MAFIA, Role.DON]));
    const qutiPhases = this.store.selectSnapshot(PlayersState.getQuitPhases);
    const aliveMafia = mafiaPlayers.filter(({ user: { id } }) => !qutiPhases.has(id));

    if (aliveMafia.length >= alivePlayers.length / 2) {
      patchState({ gameResult: GameResult.MAFIA });
      dispatch(new EndGame());
    }

    if (!aliveMafia.length) {
      patchState({ gameResult: GameResult.CIVILIANS });
      dispatch(new EndGame());
    }
  }

  @Action(StartNewRound)
  startNewRound({ dispatch, patchState, getState }: StateContext<GameStateModel>) {
    const { rounds } = cloneDeep(getState());
    const { round } = this.store.selectSnapshot(({ game }: ApplicationStateModel) => game);

    rounds.push(new Round({
      ...round.currentNight,
      ...round.currentDay,
      ...round.currentVote,
    }));
    this.timersService.resetTimers();

    dispatch([
      new StateReset(RoundState),
      new SwitchRoundPhase(RoundPhase.NIGHT),
      new Navigate(['tabs', 'table', 'game', rounds.length + 1, 'night']),
    ]);

    patchState({ rounds });
  }

  @Action(ResetIsNextVotingDisabled)
  resetIsNextVotingDisabled({ patchState }: StateContext<GameStateModel>) {
    patchState({ isNextVotingDisabled: false });
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

    dispatch(new DisableCurrentVote());
  }

  @Action(DropGame)
  dropGame({ dispatch }: StateContext<GameStateModel>) {
    dispatch([
      new StateReset(GameState),
      new Navigate(['tabs', 'table']),
    ]);
  }

  @Action(EndGame)
  endGame({ dispatch }: StateContext<GameStateModel>) {
    dispatch(new Navigate(['tabs', 'table', 'game', 'result']));
  }
}
