import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Player } from '@shared/models/player.model';
import { AddPlayer, RemovePlayer, SetHost } from './table.actions';

export interface TableStateModel {
  host: Player;
  players: Player[];
}

@State<TableStateModel>({
  name: 'table',
  defaults: {
    host: undefined,
    players: [],
  }
})
export class TableState {
  private isPlayerAlreadyPresentText = 'Игрок с таким никнеймом уже за столом.';
  private emptyNicknameText = 'У гостя должно быть имя.';
  private isPlayerAlreadyHostText = 'Этот игрок уже избран ведущим.';

  @Selector()
  static getHost(state: TableStateModel) {
    return state.host;
  }

  @Selector()
  static getPlayers(state: TableStateModel) {
    return state.players;
  }

  @Action(SetHost)
  setHost({ patchState, getState }: StateContext<TableStateModel>, { player }: SetHost) {
    const { host, players } = getState();

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

    const guestTemplate = {
      ...player,
      isGuest: true,
      user: {
        id: new Date().getTime(),
      }
    };
    const newHost = player.user?.id ? player : new Player(guestTemplate);

    return patchState({ host: newHost });
  }

  @Action(AddPlayer)
  addPlayer({ patchState, getState }: StateContext<TableStateModel>, { player }: AddPlayer) {
    const { host, players } = getState();

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

    const guestTemplate = {
      ...player,
      isGuest: true,
      user: {
        id: new Date().getTime(),
      }
    };
    const newPlayer = player.user?.id ? player : new Player(guestTemplate);
    const newPlayers = [...players, newPlayer];

    return patchState({ players: newPlayers });
  }

  @Action(RemovePlayer)
  removePlayer({ patchState, getState }: StateContext<TableStateModel>, { userId }: RemovePlayer) {
    const currentPlayers = getState().players;
    const newPlayers = currentPlayers.filter(({ user: { id } }) => id !== userId);

    patchState({ players: newPlayers });
  }
}
