import { Injectable } from '@angular/core';
import { Action, State, Selector, StateContext, createSelector } from '@ngxs/store';
import { compose, insertItem, patch, removeItem, updateItem } from '@ngxs/store/operators';
import { shuffle, cloneDeep } from 'lodash';
import { environment } from 'src/environments/environment';

import { Player } from '@/shared/models/player.model';
import { QuitPhase } from '@/shared/models/quit-phase.interface';
import { Role } from '@/shared/models/role.enum';
import { RoundPhase } from '@/table/models/day-phase.enum';

import { dummyPlayers, dummyHost } from './players-mocks';
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
  AssignRole,
} from './players.actions';

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
  host?: Player;
  players: Player[];
  falls: Map<string, number>; // <playerId, numberOfFalls>
  quitPhases: Map<string, QuitPhase>; // <playerId, quitPhase>
  speechSkips: Map<string, number>; // <playerId, roundNumber>
}

@State<PlayersStateModel>({
  name: 'players',
  defaults: {
    players: environment.production ? [] : dummyPlayers,
    host: environment.production ? null : dummyHost,
    falls: new Map<string, number>(),
    quitPhases: new Map<string, QuitPhase>(),
    speechSkips: new Map<string, number>(),
  },
})
@Injectable()
export class PlayersState {
  // TODO: Translate this
  private readonly isPlayerAlreadyPresentText = 'Игрок с таким никнеймом уже за столом.';
  private readonly emptyNicknameText = 'У гостя должно быть имя.';
  private readonly isPlayerAlreadyHostText = 'Этот игрок уже избран ведущим.';

  @Selector()
  static getState(state: PlayersStateModel) {
    return state;
  }

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
    return players.filter(({ user: { uid: id } }) => !quitPhases.has(id));
  }

  @Selector()
  static getSheriff({ players }: PlayersStateModel) {
    return players.find((player) => player.role === Role.SHERIFF);
  }

  @Selector()
  static getDon({ players }: PlayersStateModel) {
    return players.find((player) => player.role === Role.DON);
  }

  @Selector()
  static getRolesNumbers({ players }: PlayersStateModel) {
    const initial: Partial<Record<keyof typeof Role, number>> = {};

    return players.reduce((accumulator, player) => {
      if (!player.role) return accumulator;

      return {
        ...accumulator,
        [player.role]: accumulator[player.role] + 1 || 1,
      };
    }, initial);
  }

  @Selector([PlayersState.getRolesNumbers])
  static getValidRoles(ctx: PlayersStateModel, rolesNumbers: Partial<Record<keyof typeof Role, number>>) {
    const validRoles: Partial<Record<keyof typeof Role, boolean>> = {};

    Object.keys(rolesNumbers).forEach((role) => {
      switch (role) {
        case Role.CITIZEN:
          validRoles[role] = rolesNumbers[role] === 6;
          break;
        case Role.DON:
          validRoles[role] = rolesNumbers[role] === 1;
          break;
        case Role.MAFIA:
          validRoles[role] = rolesNumbers[role] === 2;
          break;
        case Role.SHERIFF:
          validRoles[role] = rolesNumbers[role] === 1;
          break;

        default:
          validRoles[role] = false;
          break;
      }
    });

    return validRoles;
  }

  static getPlayer(playerId: string) {
    return createSelector(
      [PlayersState],
      ({ players }: PlayersStateModel) => players.find((player) => player.user.uid === playerId),
    );
  }

  static getPlayerFalls(playerId: string) {
    return createSelector(
      [PlayersState],
      ({ falls }: PlayersStateModel) => falls.get(playerId),
    );
  }

  static getPlayerQuitPhase(playerId: string) {
    return createSelector(
      [PlayersState],
      ({ quitPhases }: PlayersStateModel) => {
        const quitPhase = quitPhases.get(playerId);

        if (quitPhase) {
          return `${quitPhase.number}${(quitPhase.stage === RoundPhase.NIGHT ? 'н' : 'д')}`;
        }

        return null;
      },
    );
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

    if (host?.nickname === player?.nickname) {
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
    const newPlayers = players.filter(({ user: { uid: id } }) => id !== userId);

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
    { setState, getState }: StateContext<PlayersStateModel>,
    { previoustIndex, newIndex }: ReorderPlayer,
  ) {
    const { players } = cloneDeep(getState());
    const playerToReorder = players[previoustIndex];

    setState(patch<PlayersStateModel>({
      players: compose(
        removeItem(previoustIndex),
        insertItem(playerToReorder, newIndex),
      ),
    }));
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

  @Action(AssignRole)
  assignRole(
    { setState }: StateContext<PlayersStateModel>,
    { playerId, role }: AssignRole,
  ) {
    setState(
      patch<PlayersStateModel>({
        players: updateItem(
          (player) => player.user.uid === playerId,
          (player) => ({
            ...player,
            role,
          }),
        ),
      }),
    );
  }
}
