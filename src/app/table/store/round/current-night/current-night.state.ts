
import { Injectable } from '@angular/core';
import { State, StateContext, Action, Selector } from '@ngxs/store';

import { INight } from '@/table/models/night.interface';

import {
  ShootPlayer, CheckByDon, CheckBySheriff, SetMurderedPlayer,
} from './current-night.actions';

// tslint:disable-next-line: no-empty-interface
export type CurrentNightStateModel = INight;

@State<CurrentNightStateModel>({
  name: 'currentNight',
  defaults: {
    shots: {},
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

    for (const [shooterId, victimId] of Object.entries(shots)) {
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
    const { shots } = getState();
    const newShots = { ...shots };
    const thisMafiaVictim = newShots[mafiaId];
    const isShotThisVicitm = thisMafiaVictim === victimId;

    if (isShotThisVicitm) {
      delete newShots[mafiaId];

      patchState({ shots: newShots });

      return;
    }

    newShots[mafiaId] = victimId;

    patchState({ shots: newShots });
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
