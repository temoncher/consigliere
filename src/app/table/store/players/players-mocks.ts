import { Player } from '@/shared/models/player.model';
import { Role } from '@/shared/models/role.enum';

export const dummyPlayers = [
  new Player({ nickname: 'Воланд', number: 1, user: { uid: 'voland', nickname: 'voland' }, role: Role.DON }),
  new Player({ nickname: 'Cabby', number: 2, user: { uid: 'cabby', nickname: 'cabby' }, role: Role.SHERIFF }),
  new Player({ nickname: 'Булочка', number: 3, user: { uid: 'bulochka', nickname: 'bulochka' }, role: Role.MAFIA }),
  new Player({ nickname: 'Краснова', number: 4, user: { uid: 'krasnova', nickname: 'krasnova' }, role: Role.MAFIA }),
  new Player({ nickname: 'Олежа', number: 5, user: { uid: 'olega', nickname: 'olega' }, role: Role.CITIZEN }),
  new Player({ nickname: 'Маффин', number: 6, user: { uid: 'maffin', nickname: 'maffin' }, role: Role.CITIZEN }),
  new Player({ nickname: 'Девяткин', number: 7, user: { uid: 'devyatkin', nickname: 'devyatkin' }, role: Role.CITIZEN }),
  new Player({ nickname: 'Одинаковый', number: 8, user: { uid: 'odynakoviy', nickname: 'odynakoviy' }, role: Role.CITIZEN }),
  new Player({ nickname: 'Люба', number: 9, user: { uid: 'lyba', nickname: 'lyba' }, role: Role.CITIZEN }),
  new Player({ nickname: 'Углическая', number: 10, user: { uid: 'uglicheskaya', nickname: 'uglicheskaya' }, role: Role.CITIZEN }),
];

export const dummyHost = new Player({ nickname: 'Temoncher', user: { uid: 'temoncher', nickname: 'temoncher' }, role: Role.HOST });
