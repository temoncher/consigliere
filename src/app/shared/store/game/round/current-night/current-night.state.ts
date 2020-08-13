import { Injectable } from '@angular/core';
import { State, StateContext, Action, Selector } from '@ngxs/store';
import { cloneDeep } from 'lodash';

import { Night } from '@shared/models/table/night.interface';
import {
  ShootPlayer, CheckByDon, CheckBySheriff, SetMurderedPlayer,
} from './current-night.actions';

// tslint:disable-next-line: no-empty-interface
export type CurrentNightStateModel = Night;

@State<CurrentNightStateModel>({
  name: 'currentNight',
  defaults: {
    shots: new Map<string, string>(),
  },
})
@Injectable()
export class CurrentNightState {
  private readonly thisMafiaAlreadyShotText = 'Эта мафия уже сделала выстрел';

  @Selector()
  static getShots({ shots }: CurrentNightStateModel) {
    return shots;
  }

  @Selector()
  static getVictims({ shots }: CurrentNightStateModel) {
    const victimsMap = new Map<string, string[]>();

    for (const [shooterId, victimId] of shots) {
      victimsMap.set(victimId, [...victimsMap.get(victimId) || [], shooterId]);
    }

    return victimsMap;
  }

  @Selector()
  static getDonCheck({ donCheck }: CurrentNightStateModel) {
    return donCheck;
  }

  @Selector()
  static getSheriffCheck({ sheriffCheck }: CurrentNightStateModel) {
    return sheriffCheck;
  }

  @Action(ShootPlayer)
  shootPlayer(
    { patchState, getState }: StateContext<CurrentNightStateModel>,
    { mafiaId, victimId }: ShootPlayer,
  ) {
    const { shots } = cloneDeep(getState());
    const thisMafiaVictim = shots.get(mafiaId);
    const isShotThisVicitm = thisMafiaVictim === victimId;

    if (isShotThisVicitm) {
      shots.delete(mafiaId);
      patchState({ shots });

      return;
    }

    shots.set(mafiaId, victimId);
    patchState({ shots });
  }

  @Action(CheckByDon)
  checkByDon(
    { patchState }: StateContext<CurrentNightStateModel>,
    { playerId }: CheckByDon,
  ) {
    patchState({ donCheck: playerId });
  }

  @Action(CheckBySheriff)
  checkBySheriff(
    { patchState }: StateContext<CurrentNightStateModel>,
    { playerId }: CheckBySheriff,
  ) {
    patchState({ sheriffCheck: playerId });
  }

  @Action(SetMurderedPlayer)
  setMurderedPlayer(
    { patchState }: StateContext<CurrentNightStateModel>,
    { playerId }: SetMurderedPlayer,
  ) {
    patchState({ murderedPlayer: playerId });
  }
}
