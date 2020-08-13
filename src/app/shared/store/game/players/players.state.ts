import { Injectable } from '@angular/core';
import { Action, State, Selector, StateContext, createSelector } from '@ngxs/store';
import { shuffle, cloneDeep } from 'lodash';

import { Player } from '@shared/models/player.model';
import { Role } from '@shared/models/role.enum';
import { RoundPhase } from '@shared/models/table/day-phase.enum';
import { QuitPhase } from '@shared/models/quit-phase.interface';
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
  ReorderPlayer,
  SkipSpeech,
} from './players.actions';

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
  falls: Map<string, number>; // <playerId, numberOfFalls>
  quitPhases: Map<string, QuitPhase>; // <playerId, quitPhase>
  speechSkips: Map<string, number>; // <playerId, roundNumber>
}

@State<PlayersStateModel>({
  name: 'players',
  defaults: {
    host: dummyHost,
    players: dummyPlayers,
    falls: new Map<string, number>(),
    quitPhases: new Map<string, QuitPhase>(),
    speechSkips: new Map<string, number>(),
  },
})
@Injectable()
export class PlayersState {
  private readonly isPlayerAlreadyPresentText = 'Игрок с таким никнеймом уже за столом.';
  private readonly emptyNicknameText = 'У гостя должно быть имя.';
  private readonly isPlayerAlreadyHostText = 'Этот игрок уже избран ведущим.';

  @Selector()
  static getHost({ host }: PlayersStateModel) {
    return host;
  }

  @Selector()
  static getSpeechSkips({ speechSkips }: PlayersStateModel) {
    return speechSkips;
  }

  @Selector()
  static getPlayers({ players }: PlayersStateModel) {
    return players;
  }

  @Selector()
  static getQuitPhases({ quitPhases }: PlayersStateModel) {
    return quitPhases;
  }

  @Selector()
  static getAlivePlayers({ players, quitPhases }: PlayersStateModel) {
    return players.filter(({ user: { id } }) => !quitPhases.has(id));
  }

  @Selector()
  static getSheriff({ players }: PlayersStateModel) {
    return players.find((player) => player.role === Role.SHERIFF);
  }

  @Selector()
  static getDon({ players }: PlayersStateModel) {
    return players.find((player) => player.role === Role.DON);
  }

  static getPlayer(playerId: string) {
    return createSelector([PlayersState], ({ players }: PlayersStateModel) => players.find((player) => player.user.id === playerId));
  }

  static getPlayerFalls(playerId: string) {
    return createSelector([PlayersState], ({ falls }: PlayersStateModel) => falls.get(playerId));
  }

  static getPlayerQuitPhase(playerId: string) {
    return createSelector([PlayersState], ({ quitPhases }: PlayersStateModel) => {
      const quitPhase = quitPhases.get(playerId);

      if (quitPhase) {
        return `${quitPhase.number}${(quitPhase.stage === RoundPhase.NIGHT ? 'н' : 'д')}`;
      }

      return null;
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

    patchState({ players, host });
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

    patchState({ host: player });
  }

  @Action(ShufflePlayers)
  shufflePlayers({ patchState, getState }: StateContext<PlayersStateModel>) {
    const { players } = cloneDeep(getState());
    const newPlayers = shuffle(players);

    patchState({ players: newPlayers });
  }

  @Action(SetPlayersNumbers)
  setPlayersNumbers({ patchState, getState }: StateContext<PlayersStateModel>) {
    const { players } = cloneDeep(getState());
    const newPlayers = players.map((player, index) => new Player({ ...player, number: index + 1 }));

    patchState({ players: newPlayers });
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

    const newPlayer = new Player({ ...player, number: players.length });
    const newPlayers = [...players, newPlayer];

    patchState({ players: newPlayers });
  }

  @Action(RemovePlayer)
  removePlayer({ patchState, getState }: StateContext<PlayersStateModel>, { userId }: RemovePlayer) {
    const { players } = cloneDeep(getState());
    const newPlayers = players.filter(({ user: { id } }) => id !== userId);

    patchState({ players: newPlayers });
  }

  @Action(KillPlayer)
  killPlayer(
    { patchState, getState }: StateContext<PlayersStateModel>,
    { playerId, quitPhase }: KillPlayer,
  ) {
    const { quitPhases } = cloneDeep(getState());

    quitPhases.set(playerId, quitPhase);

    patchState({ quitPhases });
  }

  @Action(ReorderPlayer)
  reorderPlayer(
    { patchState, getState }: StateContext<PlayersStateModel>,
    { previoustIndex, newIndex }: ReorderPlayer,
  ) {
    const { players } = cloneDeep(getState());
    const playerToReorder = players.splice(previoustIndex, 1)[0];

    players.splice(newIndex, 0, playerToReorder);

    patchState({ players });
  }

  @Action(ResetPlayer)
  resetPlayer(
    { patchState, getState }: StateContext<PlayersStateModel>,
    { playerId }: ResetPlayer,
  ) {
    const { quitPhases, falls } = cloneDeep(getState());

    falls.set(playerId, 0);
    quitPhases.set(playerId, null);

    patchState({ quitPhases, falls });
  }

  @Action(SkipSpeech)
  skipSpeech(
    { patchState, getState }: StateContext<PlayersStateModel>,
    { playerId, roundNumber }: SkipSpeech,
  ) {
    const { speechSkips } = cloneDeep(getState());

    speechSkips.set(playerId, roundNumber);

    patchState({ speechSkips });
  }

  @Action(AssignFall)
  assignFall(
    { patchState, getState }: StateContext<PlayersStateModel>,
    { playerId }: AssignFall,
  ) {
    const { falls } = cloneDeep(getState());
    const playerFallsNumber = falls.get(playerId);

    falls.set(playerId, playerFallsNumber ? playerFallsNumber + 1 : 1);

    patchState({ falls });
  }
}
