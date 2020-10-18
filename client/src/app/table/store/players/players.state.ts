import { Injectable } from '@angular/core';
import { Action, State, Selector, StateContext, createSelector } from '@ngxs/store';
import { compose, insertItem, patch, removeItem } from '@ngxs/store/operators';
import { shuffle } from 'lodash';

import { Player } from '@/shared/models/player.model';

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

import { Role } from '~types/enums/role.enum';
import { RoundPhase } from '~types/enums/round-phase.enum';
import { IQuitPhase } from '~types/interfaces/quit-phase.interface';

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
  host: Player | null;
  players: Player[];
  falls: Record<string, number>; // <playerId, numberOfFalls>
  quitPhases: Record<string, IQuitPhase>; // <playerId, quitPhase>
  speechSkips: Record<string, number>; // <playerId, roundNumber>
  roles: Record<string, Role>; // <playerId, role>
}

@State<PlayersStateModel>({
  name: 'players',
  defaults: {
    players: [],
    host: null,
    roles: {},
    falls: {},
    quitPhases: {},
    speechSkips: {},
  },
})
@Injectable()
export class PlayersState {
  private readonly isPlayerAlreadyPresentText = 'Игрок с таким никнеймом уже за столом.';
  private readonly emptyNicknameText = 'У гостя должно быть имя.';
  private readonly isPlayerAlreadyHostText = 'Этот игрок уже избран ведущим.';

  @Selector()
  static getState(state: PlayersStateModel): PlayersStateModel {
    return state;
  }

  @Selector()
  static getHost(state: PlayersStateModel): Player | null {
    return state.host;
  }

  @Selector()
  static getRoles(state: PlayersStateModel): Record<string, Role> {
    return state.roles;
  }

  @Selector()
  static getSpeechSkips(state: PlayersStateModel): Record<string, number> {
    return state.speechSkips;
  }

  @Selector()
  static getPlayers(state: PlayersStateModel): Player[] {
    return state.players;
  }

  @Selector()
  static getQuitPhases(state: PlayersStateModel): Record<string, IQuitPhase> {
    return state.quitPhases;
  }

  @Selector()
  static getAlivePlayers({ players, quitPhases }: PlayersStateModel): Player[] {
    return players.filter(({ uid }) => !quitPhases[uid]);
  }

  @Selector()
  static getSheriff({ players, roles }: PlayersStateModel): Player | undefined {
    return players.find((player) => roles[player.uid] === Role.SHERIFF);
  }

  @Selector()
  static getDon({ players, roles }: PlayersStateModel): Player | undefined {
    return players.find((player) => roles[player.uid] === Role.DON);
  }

  @Selector()
  static getRolesNumbers({ roles }: PlayersStateModel): Partial<Record<keyof typeof Role, number>> {
    const initial: Partial<Record<keyof typeof Role, number>> = {};

    return Object.entries(roles).reduce((accumulator, [, role]) => ({
      ...accumulator,
      [role]: (accumulator[role] || 0) + 1 || 1,
    }), initial);
  }

  @Selector([PlayersState.getRolesNumbers])
  static getValidRoles(
    ctx: PlayersStateModel,
    rolesNumbers: Partial<Record<keyof typeof Role, number>>,
  ): Partial<Record<keyof typeof Role, boolean>> {
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

        default: throw new Error('Unregistered role');
      }
    });

    return validRoles;
  }

  static getPlayer(playerId: string): (state: PlayersStateModel) => Player | undefined {
    return createSelector(
      [PlayersState],
      ({ players }: PlayersStateModel) => players.find((player) => player.uid === playerId),
    );
  }

  static getPlayerFalls(playerId: string): (state: PlayersStateModel) => number {
    return createSelector(
      [PlayersState],
      ({ falls }: PlayersStateModel) => falls[playerId],
    );
  }

  static getPlayerQuitPhase(playerId: string): (state: PlayersStateModel) => string | undefined {
    return createSelector(
      [PlayersState],
      ({ quitPhases }: PlayersStateModel) => {
        const quitPhase = quitPhases[playerId];

        if (quitPhase) {
          return `${quitPhase.number}${(quitPhase.stage === RoundPhase.NIGHT ? 'н' : 'д')}`;
        }

        return undefined;
      },
    );
  }

  static getPlayerRole(playerId: string): (playersState: PlayersStateModel) => Role {
    return createSelector(
      [PlayersState],
      ({ roles }: PlayersStateModel) => roles[playerId],
    );
  }

  static getPlayersByRoles(chosenRoles: Role[]): (playersState: PlayersStateModel) => Player[] {
    return createSelector(
      [PlayersState],
      ({ players, roles }: PlayersStateModel) => {
        const chosenRolePlayers = players.filter((player) => chosenRoles.includes(roles[player.uid]));

        return chosenRolePlayers;
      },
    );
  }

  @Action(GiveRoles)
  giveRoles({ patchState, getState }: StateContext<PlayersStateModel>): void {
    const { players } = getState();
    const initialRoles: Record<string, Role> = {};
    /* eslint-disable no-param-reassign */
    const newRoles: Record<string, Role> = shuffle([...rolesArray]).reduce((roles, currentRole, index) => {
      const playerId = players[index].uid;

      roles[playerId] = currentRole;

      return roles;
    }, initialRoles);
    /* eslint-enable */

    patchState({ roles: newRoles });
  }

  @Action(SetHost)
  setHost(
    { patchState, getState }: StateContext<PlayersStateModel>,
    { player }: SetHost,
  ): void {
    const { host, players } = getState();

    if (!player.nickname) throw new Error(this.emptyNicknameText);

    if (player.nickname === host?.nickname) throw new Error(this.isPlayerAlreadyHostText);

    const isPlayerAlreadyPresent = !!players.find((existingPlayer) => existingPlayer.nickname === player.nickname);

    if (isPlayerAlreadyPresent) throw new Error(this.isPlayerAlreadyPresentText);

    patchState({ host: player });
  }

  @Action(ShufflePlayers)
  shufflePlayers({ patchState, getState }: StateContext<PlayersStateModel>): void {
    const { players } = getState();
    const newPlayers = shuffle(players);

    patchState({ players: newPlayers });
  }

  @Action(SetPlayersNumbers)
  setPlayersNumbers({ patchState, getState }: StateContext<PlayersStateModel>): void {
    const { players } = getState();
    const newPlayers = players.map((player, index) => new Player({ ...player, number: index + 1 }));

    patchState({ players: newPlayers });
  }

  @Action(AddPlayer)
  addPlayer(
    { patchState, getState }: StateContext<PlayersStateModel>,
    { player }: AddPlayer,
  ): void {
    const { host, players, roles } = getState();
    const newRoles = { ...roles };

    if (!player.nickname) throw new Error(this.emptyNicknameText);

    if (host?.nickname === player?.nickname) throw new Error(this.isPlayerAlreadyHostText);

    const isPlayerAlreadyPresent = !!players.find((existingPlayer) => existingPlayer.nickname === player.nickname);

    if (isPlayerAlreadyPresent) throw new Error(this.isPlayerAlreadyPresentText);

    const newPlayer = new Player({ ...player, number: players.length });
    const newPlayers = [...players, newPlayer];

    newRoles[player.uid] = Role.CITIZEN;

    patchState({ players: newPlayers, roles: newRoles });
  }

  @Action(RemovePlayer)
  removePlayer(
    { setState, getState }: StateContext<PlayersStateModel>,
    { userId }: RemovePlayer,
  ): void {
    const { roles } = getState();
    const newRoles = { ...roles };

    delete newRoles[userId];

    setState(patch<PlayersStateModel>({
      players: removeItem((player) => player?.uid === userId),
      roles: newRoles,
    }));
  }

  @Action(KillPlayer)
  killPlayer(
    { patchState, getState }: StateContext<PlayersStateModel>,
    { playerId, quitPhase }: KillPlayer,
  ): void {
    const { quitPhases } = getState();

    const newQuitPhases = {
      ...quitPhases,
      [playerId]: quitPhase,
    };

    patchState({ quitPhases: newQuitPhases });
  }

  @Action(ReorderPlayer)
  reorderPlayer(
    { setState, getState }: StateContext<PlayersStateModel>,
    { previoustIndex, newIndex }: ReorderPlayer,
  ): void {
    const { players } = getState();
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
  ): void {
    const { quitPhases, falls } = getState();
    const newQuitPhases = { ...quitPhases };

    delete newQuitPhases[playerId];

    patchState({
      quitPhases: newQuitPhases,
      falls: { ...falls, [playerId]: 0 },
    });
  }

  @Action(SkipSpeech)
  skipSpeech(
    { patchState, getState }: StateContext<PlayersStateModel>,
    { playerId, roundNumber }: SkipSpeech,
  ): void {
    const { speechSkips } = getState();

    const newSpeechSkips = {
      ...speechSkips,
      [playerId]: roundNumber,
    };

    patchState({ speechSkips: newSpeechSkips });
  }

  @Action(AssignFall)
  assignFall(
    { patchState, getState }: StateContext<PlayersStateModel>,
    { playerId }: AssignFall,
  ): void {
    const { falls } = getState();
    const playerFallsNumber = falls[playerId];

    const newFalls = {
      [playerId]: playerFallsNumber ? playerFallsNumber + 1 : 1,
    };

    patchState({ falls: newFalls });
  }

  @Action(AssignRole)
  assignRole(
    { patchState, getState }: StateContext<PlayersStateModel>,
    { playerId, role }: AssignRole,
  ): void {
    const { roles } = getState();
    const newRoles = {
      ...roles,
      [playerId]: role,
    };

    patchState({ roles: newRoles });
  }
}
