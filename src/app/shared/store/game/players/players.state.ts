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
  SetPlayersNumbers,
} from './players.actions';
import { KickPlayer, ResetCurrentDayPlayerState, StopSpeech } from '../current-day/current-day.actions';
import { Injectable } from '@angular/core';
import { ApplicationStateModel } from '@shared/store';
import { TimersService } from '@shared/services/timers.service';
import { DayPhase } from '@shared/models/table/day-phase.enum';

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
  private readonly isPlayerAlreadyPresentText = 'Игрок с таким никнеймом уже за столом.';
  private readonly emptyNicknameText = 'У гостя должно быть имя.';
  private readonly isPlayerAlreadyHostText = 'Этот игрок уже избран ведущим.';

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
  static getAlivePlayers(state: PlayersStateModel) {
    return state.players.filter((player) => !player.quitPhase);
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

  static getPlayersByRoles(roles: Role[]) {
    return createSelector(
      [PlayersState],
      ({ players }: PlayersStateModel) => players.filter((player) => roles.includes(player.role)),
    );
  }

  @Action(GiveRoles)
  giveRoles({ patchState, getState }: StateContext<PlayersStateModel>) {
    const { players, host } = cloneDeep(getState());
    const roles = shuffle([...rolesArray]);
    host.role = Role.HOST;

    for (const [index, player] of players.entries()) {
      player.role = roles[index];
    }

    return patchState({ players, host });
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
    const newPlayers = shuffle(players);

    return patchState({ players: newPlayers });
  }

  @Action(SetPlayersNumbers)
  setPlayersNumbers({ patchState, getState }: StateContext<PlayersStateModel>) {
    const { players } = cloneDeep(getState());
    const newPlayers = players.map((player, index) => new Player({ ...player, number: index + 1 }));

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

    return patchState({ players: newPlayers });
  }

  @Action(KillPlayer)
  killPlayer(
    { dispatch, patchState, getState }: StateContext<PlayersStateModel>,
    { playerId }: KillPlayer,
  ) {
    const { players } = cloneDeep(getState());
    const foundPlayer = players.find((player) => player.user.id === playerId);
    const days = this.store.selectSnapshot((state: ApplicationStateModel) => state.game.days);
    const stage = this.store.selectSnapshot((state: ApplicationStateModel) => state.game.currentDay.currentPhase);

    foundPlayer.quitPhase = {
      stage,
      number: days.length,
    };

    if (stage === DayPhase.DAY) {
      dispatch(new StopSpeech(playerId));
    }

    return patchState({ players });
  }

  @Action(ResetPlayer)
  resetPlayer(
    { dispatch, patchState, getState }: StateContext<PlayersStateModel>,
    { playerId }: ResetPlayer,
  ) {
    const { players } = cloneDeep(getState());
    const foundPlayer = players.find((player) => player.user.id === playerId);

    foundPlayer.falls = 0;
    foundPlayer.quitPhase = null;

    dispatch(new ResetCurrentDayPlayerState(playerId));

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
        const currentDayNumber = this.store.selectSnapshot((state: ApplicationStateModel) => state.game.days).length;
        const finishedTimers = this.store.selectSnapshot((state: ApplicationStateModel) => state.game.currentDay.timers);
        const playerTimer = this.timersService.getPlayerTimer(playerId);
        const isPlayerAlreadySpoke = finishedTimers.get(playerId) || !playerTimer.isTimerPaused;

        foundPlayer.disabledSpeechDayNumber = isPlayerAlreadySpoke ? currentDayNumber + 1 : currentDayNumber;
        if (!isPlayerAlreadySpoke) {
          this.timersService.setTimer(playerId, 0);
        }
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
