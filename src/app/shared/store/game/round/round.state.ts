import { Injectable } from '@angular/core';
import {
  State, Selector, Action, StateContext,
} from '@ngxs/store';
import { RoundPhase } from '@shared/models/table/day-phase.enum';
import { Round } from '@shared/models/table/round.model';
import { cloneDeep } from 'lodash';

import { CurrentDayState } from './current-day/current-day.state';
import { CurrentNightState } from './current-night/current-night.state';
import { CurrentVoteState } from './current-vote/current-vote.state';
import { SwitchRoundPhase, KickPlayer, ResetKickedPlayer } from './round.actions';

export interface RoundStateModel extends Round {
  kickedPlayers: string[];
  currentPhase: RoundPhase;
}

@State({
  name: 'round',
  defaults: {
    kickedPlayers: [],
    currentPhase: RoundPhase.NIGHT,
  },
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
    patchState({ currentPhase: roundPhase });
  }

  @Action(KickPlayer)
  kickPlayer(
    { patchState, getState }: StateContext<RoundStateModel>,
    { playerId }: KickPlayer,
  ) {
    const { kickedPlayers } = cloneDeep(getState());

    kickedPlayers.push(playerId);

    patchState({ kickedPlayers });
  }

  @Action(ResetKickedPlayer)
  resetKickedPlayer(
    { patchState, getState }: StateContext<RoundStateModel>,
    { playerId }: ResetKickedPlayer,
  ) {
    const { kickedPlayers } = cloneDeep(getState());

    kickedPlayers.filter((kickedPlayerId) => kickedPlayerId !== playerId);

    patchState({ kickedPlayers });
  }
}
