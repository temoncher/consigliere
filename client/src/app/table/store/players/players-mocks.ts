import { Player } from '@/shared/models/player.model';

import { Role } from '~/types/enums/role.enum';

export const dummyPlayers = [
  new Player({ nickname: 'Воланд', uid: 'voland' }),
  new Player({ nickname: 'Cabby', uid: 'cabby' }),
  new Player({ nickname: 'Булочка', uid: 'bulochka' }),
  new Player({ nickname: 'Краснова', uid: 'krasnova' }),
  new Player({ nickname: 'Олежа', uid: 'olega' }),
  new Player({ nickname: 'Маффин', uid: 'maffin' }),
  new Player({ nickname: 'Девяткин', uid: 'devyatkin' }),
  new Player({ nickname: 'Одинаковый', uid: 'odynakoviy' }),
  new Player({ nickname: 'Люба', uid: 'lyba' }),
  new Player({ nickname: 'Углическая', uid: 'uglicheskaya' }),
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
