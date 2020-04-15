import { State, Action, StateContext, Selector } from '@ngxs/store';
import { shuffle } from 'lodash';

import { Player } from '@shared/models/player.model';
import { Role } from '@shared/models/role.enum';
import { Day } from '@shared/models/table/day.model';
import {
  AddPlayer,
  RemovePlayer,
  SetHost,
  ShufflePlayers,
  GiveRoles,
} from './table.player.actions';
import { StartNewDay, EndPlayerSpeech, VoteForCandidate } from './table.day.actions';

const dummyPlayers = [
  new Player({ nickname: 'Воланд', user: { id: 'voland' } }),
  new Player({ nickname: 'Cabby', user: { id: 'cabby' } }),
  new Player({ nickname: 'Булочка', user: { id: 'bulochka' } }),
  new Player({ nickname: 'Краснова', user: { id: 'krasnova' } }),
  new Player({ nickname: 'Олежа', user: { id: 'olega' } }),
  new Player({ nickname: 'Маффин', user: { id: 'maffin' } }),
  new Player({ nickname: 'Девяткин', user: { id: 'devyatkin' } }),
  new Player({ nickname: 'Одинаковый', user: { id: 'odynakoviy' } }),
  new Player({ nickname: 'Люба', user: { id: 'lyba' } }),
  new Player({ nickname: 'Углическая', user: { id: 'uglicheskaya' } }),
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
  Role.CITIZEN
];
export interface TableStateModel {
  host: Player;
  falls: Map<string, number>; // <playerId, number of falls>
  players: Player[];
  days: Day[];
}

@State<TableStateModel>({
  name: 'table',
  defaults: {
    falls: new Map<string, number>(),
    host: dummyHost,
    players: dummyPlayers,
    days: [],
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

  @Selector()
  static getDays(state: TableStateModel) {
    return state.days;
  }

  @Selector()
  static getCurrentDay(state: TableStateModel) {
    return state.days[state.days.length - 1];
  }
  // #region Day actions
  @Action(StartNewDay)
  startNewDay({ patchState, getState }: StateContext<TableStateModel>) {
    const { days } = getState();
    days.push(new Day());

    return patchState({ days });
  }

  @Action(EndPlayerSpeech)
  endPlayerSpeech(
    { patchState, getState }: StateContext<TableStateModel>,
    {
      playerId,
      timeLeft,
      proposedPlayerId,
    }: EndPlayerSpeech
  ) {
    const { days } = getState();
    const currentDay = days[days.length - 1];
    currentDay.timers[playerId] = timeLeft;
    if (!currentDay.proposedPlayers.includes(proposedPlayerId)) {
      currentDay.proposedPlayers.push(proposedPlayerId);
    }

    return patchState({ days });
  }

  @Action(VoteForCandidate)
  voteForPerson(
    { patchState, getState }: StateContext<TableStateModel>,
    {
      playerIds,
      proposedPlayerId,
    }: VoteForCandidate
  ) {
    const { days } = getState();
    const currentDay = days[days.length - 1];

    if (proposedPlayerId) {
      if (!currentDay.votes[0]) {
        currentDay.votes.push(new Map<string, string[]>());
      }

      const vote = currentDay.votes[0];

      for (const votedPlayers of vote.values()) {
        votedPlayers.filter((votedPlayerId) => playerIds.includes(votedPlayerId));
      }

      vote[proposedPlayerId] = playerIds;
    }

    return patchState({ days });
  }
  // #endregion

  //#region Player actions
  @Action(GiveRoles)
  giveRoles({ patchState, getState }: StateContext<TableStateModel>) {
    const { players } = getState();
    const roles = shuffle([...rolesArray]);

    for (const [index, player] of players.entries()) {
      player.role = roles[index];
    }

    return patchState({ players });
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

  @Action(ShufflePlayers)
  shufflePlayers({ patchState, getState }: StateContext<TableStateModel>) {
    const { players } = getState();

    return patchState({ players: shuffle(players) });
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
  // #endregion
}
