import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Player } from '@shared/models/player.model';
import { AddPlayer, RemovePlayer } from './table.actions';

export interface TableStateModel {
  players: Player[];
}

@State<TableStateModel>({
  name: 'table',
  defaults: {
    players: []
  }
})
export class TableState {
  private isPlayerAlreadyPresentText = 'Игрок с таким никнеймом уже за столом.';
  private emptyNicknameText = 'У гостя должно быть имя.';

  @Selector()
  static getPlayers(state: TableStateModel) {
    return state.players;
  }

  @Action(AddPlayer)
  addPlayer({ patchState, getState }: StateContext<TableStateModel>, { player }: AddPlayer) {
    if (!player.nickname) {
      throw new Error(this.emptyNicknameText);
    }

    const currentPlayers = getState().players;
    const isPlayerAlreadyPresent = currentPlayers.find((existingPlayer) => existingPlayer.nickname === player.nickname);

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

    const newPlayers = [...currentPlayers, newPlayer];
    return patchState({ players: newPlayers });
  }

  @Action(RemovePlayer)
  removePlayer({ patchState, getState }: StateContext<TableStateModel>, { userId }: RemovePlayer) {
    const currentPlayers = getState().players;
    const newPlayers = currentPlayers.filter(({ user: { id } }) => id !== userId);

    patchState({ players: newPlayers });
  }
}
