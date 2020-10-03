import { Injectable } from '@angular/core';
import {
  State,
  Selector,
  Action,
  StateContext,
} from '@ngxs/store';
import { append, patch, removeItem } from '@ngxs/store/operators';

import { RoundPhase } from '@/table/models/day-phase.enum';
import { IRound } from '@/table/models/round.interface';

import { CurrentDayState } from './current-day/current-day.state';
import { CurrentNightState } from './current-night/current-night.state';
import { CurrentVoteState } from './current-vote/current-vote.state';
import { SwitchRoundPhase, KickPlayer, ResetKickedPlayer } from './round.actions';

export interface RoundStateModel extends IRound {
  currentPhase: RoundPhase;
}

@State({
  name: 'round',
  defaults: {
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
  @Selector()
  static getKickedPlayers({ kickedPlayers }: RoundStateModel) {
    return kickedPlayers || [];
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
    { setState }: StateContext<RoundStateModel>,
    { playerId }: KickPlayer,
  ) {
    setState(patch<RoundStateModel>({
      kickedPlayers: append([playerId]),
    }));
  }

  @Action(ResetKickedPlayer)
  resetKickedPlayer(
    { setState }: StateContext<RoundStateModel>,
    { playerId }: ResetKickedPlayer,
  ) {
    setState(patch<RoundStateModel>({
      kickedPlayers: removeItem((kickedPlayerId) => kickedPlayerId === playerId),
    }));
  }
}
