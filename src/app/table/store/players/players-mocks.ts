import { Player } from '@/shared/models/player.model';
import { Role } from '@/shared/models/role.enum';

export const dummyPlayers = [
  new Player({ nickname: 'Воланд', number: 1, user: { uid: 'voland', nickname: 'voland' } }),
  new Player({ nickname: 'Cabby', number: 2, user: { uid: 'cabby', nickname: 'cabby' } }),
  new Player({ nickname: 'Булочка', number: 3, user: { uid: 'bulochka', nickname: 'bulochka' } }),
  new Player({ nickname: 'Краснова', number: 4, user: { uid: 'krasnova', nickname: 'krasnova' } }),
  new Player({ nickname: 'Олежа', number: 5, user: { uid: 'olega', nickname: 'olega' } }),
  new Player({ nickname: 'Маффин', number: 6, user: { uid: 'maffin', nickname: 'maffin' } }),
  new Player({ nickname: 'Девяткин', number: 7, user: { uid: 'devyatkin', nickname: 'devyatkin' } }),
  new Player({ nickname: 'Одинаковый', number: 8, user: { uid: 'odynakoviy', nickname: 'odynakoviy' } }),
  new Player({ nickname: 'Люба', number: 9, user: { uid: 'lyba', nickname: 'lyba' } }),
  new Player({ nickname: 'Углическая', number: 10, user: { uid: 'uglicheskaya', nickname: 'uglicheskaya' } }),
];

export const dummyPlayersRoles: Record<string, Role> = {
  voland: Role.DON,
  cabby: Role.SHERIFF,
  bulochka: Role.MAFIA,
  krasnova: Role.MAFIA,
  olega: Role.CITIZEN,
  maffin: Role.CITIZEN,
  devyatkin: Role.CITIZEN,
  odynakoviy: Role.CITIZEN,
  lyba: Role.CITIZEN,
  uglicheskaya: Role.CITIZEN,
};

export const dummyHost = new Player({ nickname: 'Temoncher', user: { uid: 'temoncher', nickname: 'temoncher' } });
