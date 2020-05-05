import { Injectable } from '@angular/core';
import { State, Selector, Action, StateContext } from '@ngxs/store';
import { cloneDeep } from 'lodash';

import { Round } from '@shared/models/table/round.model';
import { RoundPhase } from '@shared/models/table/day-phase.enum';
import { CurrentVoteState } from './current-vote/current-vote.state';
import { CurrentNightState } from './current-night/current-night.state';
import { CurrentDayState } from './current-day/current-day.state';
import { SwitchRoundPhase, KickPlayer, ResetKickedPlayer } from './round.actions';
import { KillPlayer } from '../players/players.actions';
import { ResetProposedPlayers } from './current-day/current-day.actions';
import { DisableVote } from '../game.actions';

export interface RoundStateModel extends Round {
  kickedPlayers: string[];
  currentPhase: RoundPhase;
}

@State({
  name: 'round',
  children: [
    CurrentNightState,
    CurrentDayState,
    CurrentVoteState,
  ],
})
@Injectable()
export class RoundState {

  @Selector()
  static getRoundPhase({ currentPhase }: RoundStateModel) {
    return currentPhase;
  }

  @Action(SwitchRoundPhase)
  switchRoundPhase(
    { patchState }: StateContext<RoundStateModel>,
    { roundPhase }: SwitchRoundPhase,
  ) {
    return patchState({ currentPhase: roundPhase });
  }

  @Action(KickPlayer)
  kickPlayer(
    { dispatch, patchState, getState }: StateContext<RoundStateModel>,
    { playerId }: KickPlayer,
  ) {
    const { kickedPlayers } = cloneDeep(getState());

    kickedPlayers.push(playerId);

    dispatch([
      new KillPlayer(playerId),
      new ResetProposedPlayers(),
      new DisableVote(),
    ]);

    return patchState({ kickedPlayers });
  }

  @Action(ResetKickedPlayer)
  resetKickedPlayer(
    { patchState, getState }: StateContext<RoundStateModel>,
    { playerId }: ResetKickedPlayer,
  ) {
    const { kickedPlayers } = cloneDeep(getState());

    kickedPlayers.filter((kickedPlayerId) => kickedPlayerId !== playerId);

    return patchState({ kickedPlayers });
  }
}
