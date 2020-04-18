import { State, Action, StateContext, Selector, createSelector } from '@ngxs/store';
import { shuffle } from 'lodash';

import { Player } from '@shared/models/player.model';
import { Role } from '@shared/models/role.enum';
import { Day } from '@shared/models/day.model';
import {
  AddPlayer,
  RemovePlayer,
  SetHost,
  ShufflePlayers,
  GiveRoles,
} from './table.preparation.actions';
import {
  StartNewDay,
  StopSpeech,
  VoteForCandidate,
  ResetPlayer,
  ProposePlayer,
  WithdrawPlayer,
} from './table.day.actions';

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
  },
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

  static getProposedPlayer(playerId: string) {
    return createSelector([TableState], ({ days, players }: TableStateModel) => {
      const proposedPlayers = days[days.length - 1].proposedPlayers;
      let foundCandidateId = null;

      for (const [candidateId, proposingPlayerId] of proposedPlayers.entries()) {
        if (playerId === proposingPlayerId) {
          foundCandidateId = candidateId;
        }
      }

      if (foundCandidateId) {
        const foundPlayer = players.find((player) => player.user.id === foundCandidateId);

        return foundPlayer;
      }

      return null;
    });
  }

  @Selector()
  static getSheriff(state: TableStateModel) {
    return state.players.find((player) => player.role === Role.SHERIFF);
  }

  @Selector()
  static getDon(state: TableStateModel) {
    return state.players.find((player) => player.role === Role.DON);
  }

  // #region Day actions
  @Action(StartNewDay)
  startNewDay({ patchState, getState }: StateContext<TableStateModel>) {
    const { days } = getState();
    days.push(new Day());

    return patchState({ days });
  }

  @Action(WithdrawPlayer)
  withdrawPlayer(
    { patchState, getState }: StateContext<TableStateModel>,
    { playerId }: WithdrawPlayer,
  ) {
    const { days } = getState();
    const proposedPlayers = days[days.length - 1].proposedPlayers;
    let foundCandidateId = null;

    for (const [candidateId, proposingPlayerId] of proposedPlayers.entries()) {
      if (playerId === proposingPlayerId) {
        foundCandidateId = candidateId;
      }
    }

    if (foundCandidateId) {
      proposedPlayers.delete(foundCandidateId);
    }

    return patchState({ days });
  }

  @Action(StopSpeech)
  stopSpeech(
    { patchState, getState }: StateContext<TableStateModel>,
    {
      playerId,
      timeLeft,
    }: StopSpeech,
  ) {
    const { days } = getState();
    const currentDay = days[days.length - 1];

    currentDay.timers[playerId] = timeLeft;

    return patchState({ days });
  }

  @Action(ProposePlayer)
  proposePlayer(
    { patchState, getState }: StateContext<TableStateModel>,
    {
      playerId,
      candidateId,
    }: ProposePlayer,
  ) {
    const { days } = getState();
    const currentDay = days[days.length - 1];

    if (!currentDay.proposedPlayers.has(candidateId)) {
      currentDay.proposedPlayers.set(candidateId, playerId);
    }

    return patchState({ days });
  }

  @Action(VoteForCandidate)
  voteForPerson(
    { patchState, getState }: StateContext<TableStateModel>,
    {
      playerIds,
      proposedPlayerId,
    }: VoteForCandidate,
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

  @Action(ResetPlayer)
  resetPlayer({ patchState, getState }: StateContext<TableStateModel>, { playerId }: ResetPlayer) {
    const { days } = getState();
    const currentDay = days[days.length - 1];

    currentDay.timers[playerId] = null;

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

    return patchState({ host: player });
  }

  @Action(ShufflePlayers)
  shufflePlayers({ patchState, getState }: StateContext<TableStateModel>) {
    const { players } = getState();
    const newPlayers = shuffle(players).map((player, index) => new Player({ ...player, number: index + 1 }));

    return patchState({ players: newPlayers });
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

    player.number = players.length;
    const newPlayer = new Player({ ...player, number: players.length });
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
