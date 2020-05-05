
import { Injectable } from '@angular/core';
import { State, Store, StateContext, Action, Selector } from '@ngxs/store';
import { cloneDeep } from 'lodash';
import { Navigate } from '@ngxs/router-plugin';

import { Night } from '@shared/models/table/night.interface';
import { RoundPhase } from '@shared/models/table/day-phase.enum';
import { ApplicationStateModel } from '@shared/store';
import { ShootPlayer, EndNight } from './current-night.actions';
import { SwitchRoundPhase } from '../round.actions';

// tslint:disable-next-line: no-empty-interface
export interface CurrentNightStateModel extends Night { }

@State<CurrentNightStateModel>({
  name: 'currentNight',
})
@Injectable()
export class CurrentNightState {
  private readonly thisMafiaAlreadyShotText = 'Эта мафия уже сделала выстрел';

  constructor(
    private store: Store,
  ) { }

  @Selector()
  static getShots({ shots }: CurrentNightStateModel) {
    return shots;
  }

  @Action(ShootPlayer)
  shootPlayer(
    { patchState, getState }: StateContext<CurrentNightStateModel>,
    { mafiaId, victimId }: ShootPlayer,
  ) {
    const { shots } = cloneDeep(getState());

    const thisMafiaVictim = shots.get(mafiaId);

    if (thisMafiaVictim) {
      const isShotThisVicitm = thisMafiaVictim === victimId;

      if (!isShotThisVicitm) {
        throw new Error(this.thisMafiaAlreadyShotText);
      }

      shots.delete(mafiaId);
      return patchState({ shots });
    }

    shots.set(mafiaId, victimId);

    return patchState({ shots });
  }

  @Action(EndNight)
  endNight(
    { dispatch }: StateContext<CurrentNightStateModel>,
  ) {
    const currentDayNumber = this.store.selectSnapshot((state: ApplicationStateModel) => state.game.rounds).length;

    return dispatch([
      new SwitchRoundPhase(RoundPhase.DAY),
      new Navigate(['tabs', 'table', 'game', currentDayNumber, 'day']),
    ]);
  }
}
