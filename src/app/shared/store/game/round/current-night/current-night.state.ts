
import { Injectable } from '@angular/core';
import { State, Store, StateContext, Action, Selector } from '@ngxs/store';
import { cloneDeep } from 'lodash';
import { Navigate } from '@ngxs/router-plugin';

import { Night } from '@shared/models/table/night.interface';
import { RoundPhase } from '@shared/models/table/day-phase.enum';
import { ApplicationStateModel } from '@shared/store';
import { ShootPlayer, EndNight, CheckByDon, CheckBySheriff } from './current-night.actions';
import { SwitchRoundPhase } from '../round.actions';
import { Role } from '@shared/models/role.enum';
import { KillPlayer } from '../../players/players.actions';

// tslint:disable-next-line: no-empty-interface
export interface CurrentNightStateModel extends Night { }

@State<CurrentNightStateModel>({
  name: 'currentNight',
  defaults: {
    shots: new Map<string, string>(),
  },
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

    if (thisMafiaVictim) {
      const isShotThisVicitm = thisMafiaVictim === victimId;

      if (!isShotThisVicitm) {
        throw new Error(this.thisMafiaAlreadyShotText);
      }

      shots.delete(mafiaId);
      return patchState({ shots });
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

  @Action(EndNight)
  endNight(
    { dispatch, patchState }: StateContext<CurrentNightStateModel>,
  ) {
    const {
      rounds,
      players: {
        players,
        quitPhases,
      },
    } = this.store.selectSnapshot(({ game }: ApplicationStateModel) => game);
    const victimsMap = this.store.selectSnapshot(CurrentNightState.getVictims);
    const aliveMafia = players.filter((player) => !quitPhases.has(player.user.id) &&
      (player.role === Role.DON || player.role === Role.MAFIA));
    let murderedPlayer: string;

    for (const [victimId, mafiaIds] of victimsMap) {
      if (mafiaIds.length === aliveMafia.length) {
        murderedPlayer = victimId;
      }
    }

    if (murderedPlayer) {
      dispatch(new KillPlayer(murderedPlayer));
      patchState({ murderedPlayer });
    }

    dispatch([
      new SwitchRoundPhase(RoundPhase.DAY),
      new Navigate(['tabs', 'table', 'game', rounds.length, 'day']),
    ]);
  }
}
