import { Player } from '@/shared/models/player.model';
import { Role } from '@/shared/models/role.enum';

export const dummyPlayers = [
  new Player({ nickname: 'Воланд', number: 1, uid: 'voland' }),
  new Player({ nickname: 'Cabby', number: 2, uid: 'cabby' }),
  new Player({ nickname: 'Булочка', number: 3, uid: 'bulochka' }),
  new Player({ nickname: 'Краснова', number: 4, uid: 'krasnova' }),
  new Player({ nickname: 'Олежа', number: 5, uid: 'olega' }),
  new Player({ nickname: 'Маффин', number: 6, uid: 'maffin' }),
  new Player({ nickname: 'Девяткин', number: 7, uid: 'devyatkin' }),
  new Player({ nickname: 'Одинаковый', number: 8, uid: 'odynakoviy' }),
  new Player({ nickname: 'Люба', number: 9, uid: 'lyba' }),
  new Player({ nickname: 'Углическая', number: 10, uid: 'uglicheskaya' }),
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

export const dummyHost = new Player({ nickname: 'Temoncher', uid: 'temoncher' });
