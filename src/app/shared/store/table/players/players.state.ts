import { Action, State, Selector, StateContext, Store, createSelector } from '@ngxs/store';
import { shuffle, cloneDeep } from 'lodash';

import { Player } from '@shared/models/player.model';
import { Role } from '@shared/models/role.enum';
import {
  GiveRoles,
  SetHost,
  ShufflePlayers,
  AddPlayer,
  RemovePlayer,
  AssignFall,
  KillPlayer,
  ResetPlayer,
} from './players.actions';
import { KickPlayer } from '../current-day/current-day.actions';
import { Injectable } from '@angular/core';
import { ApplicationStateModel } from '@shared/store';
import { TimersService } from '@shared/services/timers.service';

const dummyPlayers = [
  new Player({ nickname: 'Воланд', number: 1, user: { id: 'voland' } }),
  new Player({ nickname: 'Cabby', number: 2, user: { id: 'cabby' } }),
  new Player({ nickname: 'Булочка', number: 3, user: { id: 'bulochka' } }),
  new Player({ nickname: 'Краснова', number: 4, user: { id: 'krasnova' } }),
  new Player({ nickname: 'Олежа', number: 5, user: { id: 'olega' } }),
  new Player({ nickname: 'Маффин', number: 6, user: { id: 'maffin' } }),
  new Player({ nickname: 'Девяткин', number: 7, user: { id: 'devyatkin' } }),
  new Player({ nickname: 'Одинаковый', number: 8, user: { id: 'odynakoviy' } }),
  new Player({ nickname: 'Люба', number: 9, user: { id: 'lyba' } }),
  new Player({ nickname: 'Углическая', number: 10, user: { id: 'uglicheskaya' } }),
];
const dummyHost = new Player({ nickname: 'Temoncher', user: { id: 'temoncher' } });
const rolesArray = [
  Role.DON,
  Role.SHERIFF,
  Role.MAFIA,
  Role.MAFIA,
  Role.CITIZEN,
  Role.CITIZEN,
  Role.CITIZEN,
  Role.CITIZEN,
  Role.CITIZEN,
  Role.CITIZEN,
];

export interface PlayersStateModel {
  host: Player;
  players: Player[];
}

@State<PlayersStateModel>({
  name: 'players',
  defaults: {
    host: dummyHost,
    players: dummyPlayers,
  },
})
@Injectable()
export class PlayersState {
  private isPlayerAlreadyPresentText = 'Игрок с таким никнеймом уже за столом.';
  private emptyNicknameText = 'У гостя должно быть имя.';
  private isPlayerAlreadyHostText = 'Этот игрок уже избран ведущим.';

  constructor(
    private store: Store,
    private timersService: TimersService,
    ) { }

  @Selector()
  static getHost(state: PlayersStateModel) {
    return state.host;
  }

  @Selector()
  static getPlayers(state: PlayersStateModel) {
    return state.players;
  }

  @Selector()
  static getSheriff(state: PlayersStateModel) {
    return state.players.find((player) => player.role === Role.SHERIFF);
  }

  @Selector()
  static getDon(state: PlayersStateModel) {
    return state.players.find((player) => player.role === Role.DON);
  }

  static getPlayer(playerId: string) {
    return createSelector([PlayersState], ({ players }: PlayersStateModel) => {
      return players.find((player) => player.user.id === playerId);
    });
  }

  @Action(GiveRoles)
  giveRoles({ patchState, getState }: StateContext<PlayersStateModel>) {
    const { players } = cloneDeep(getState());
    const roles = shuffle([...rolesArray]);

    for (const [index, player] of players.entries()) {
      player.role = roles[index];
    }

    return patchState({ players });
  }

  @Action(SetHost)
  setHost({ patchState, getState }: StateContext<PlayersStateModel>, { player }: SetHost) {
    const { host, players } = cloneDeep(getState());

    if (!player.nickname) {
      throw new Error(this.emptyNicknameText);
    }

    if (player.nickname === host?.nickname) {
      throw new Error(this.isPlayerAlreadyHostText);
    }

    const isPlayerAlreadyPresent = !!players.find((existingPlayer) => existingPlayer.nickname === player.nickname);

    if (isPlayerAlreadyPresent) {
      throw new Error(this.isPlayerAlreadyPresentText);
    }

    return patchState({ host: player });
  }

  @Action(ShufflePlayers)
  shufflePlayers({ patchState, getState }: StateContext<PlayersStateModel>) {
    const { players } = cloneDeep(getState());
    const newPlayers = shuffle(players).map((player, index) => new Player({ ...player, number: index + 1 }));

    return patchState({ players: newPlayers });
  }

  @Action(AddPlayer)
  addPlayer({ patchState, getState }: StateContext<PlayersStateModel>, { player }: AddPlayer) {
    const { host, players } = cloneDeep(getState());

    if (!player.nickname) {
      throw new Error(this.emptyNicknameText);
    }

    if (host?.user?.id === player.user?.id) {
      throw new Error(this.isPlayerAlreadyHostText);
    }

    const isPlayerAlreadyPresent = !!players.find((existingPlayer) => existingPlayer.nickname === player.nickname);

    if (isPlayerAlreadyPresent) {
      throw new Error(this.isPlayerAlreadyPresentText);
    }

    player.number = players.length;
    const newPlayer = new Player({ ...player, number: players.length });
    const newPlayers = [...players, newPlayer];

    return patchState({ players: newPlayers });
  }

  @Action(RemovePlayer)
  removePlayer({ patchState, getState }: StateContext<PlayersStateModel>, { userId }: RemovePlayer) {
    const { players } = cloneDeep(getState());
    const newPlayers = players.filter(({ user: { id } }) => id !== userId);

    patchState({ players: newPlayers });
  }

  @Action(KillPlayer)
  killPlayer({ patchState, getState }: StateContext<PlayersStateModel>, { playerId }: KillPlayer) {
    const { players } = cloneDeep(getState());
    const foundPlayer = players.find((player) => player.user.id === playerId);
    const days = this.store.selectSnapshot((state: ApplicationStateModel) => state.table.days);
    const stage = this.store.selectSnapshot((state: ApplicationStateModel) => state.table.currentDay.currentPhase);

    foundPlayer.quitPhase = {
      stage,
      number: days.length,
    };

    this.timersService.getPlayerTimer(playerId).endSpeech();

    patchState({ players });
  }

  @Action(ResetPlayer)
  resetPlayer(
    { patchState, getState }: StateContext<PlayersStateModel>,
    { playerId }: ResetPlayer,
  ) {
    const { players } = cloneDeep(getState());
    const foundPlayer = players.find((player) => player.user.id === playerId);

    foundPlayer.falls = 0;
    foundPlayer.quitPhase = null;

    return patchState({ players });
  }

  @Action(AssignFall)
  assignFall(
    { dispatch, patchState, getState }: StateContext<PlayersStateModel>,
    { playerId }: AssignFall,
  ) {
    const { players } = cloneDeep(getState());
    const foundPlayer = players.find((player) => player.user.id === playerId);

    foundPlayer.falls++;
    switch (foundPlayer.falls) {
      case 3:
        foundPlayer.nextSpeechTime = 0;
        break;
      case 4:
        dispatch(new KickPlayer(playerId));
        break;

      default:
        break;
    }

    return patchState({ players });
  }
}
