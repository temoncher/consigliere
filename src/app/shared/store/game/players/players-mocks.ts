import { Player } from '@shared/models/player.model';
import { Role } from '@shared/models/role.enum';

export const dummyPlayers = [
  new Player({ nickname: 'Воланд', number: 1, user: { id: 'voland' }, role: Role.DON }),
  new Player({ nickname: 'Cabby', number: 2, user: { id: 'cabby' }, role: Role.SHERIFF }),
  new Player({ nickname: 'Булочка', number: 3, user: { id: 'bulochka' }, role: Role.MAFIA }),
  new Player({ nickname: 'Краснова', number: 4, user: { id: 'krasnova' }, role: Role.MAFIA }),
  new Player({ nickname: 'Олежа', number: 5, user: { id: 'olega' }, role: Role.CITIZEN }),
  new Player({ nickname: 'Маффин', number: 6, user: { id: 'maffin' }, role: Role.CITIZEN }),
  new Player({ nickname: 'Девяткин', number: 7, user: { id: 'devyatkin' }, role: Role.CITIZEN }),
  new Player({ nickname: 'Одинаковый', number: 8, user: { id: 'odynakoviy' }, role: Role.CITIZEN }),
  new Player({ nickname: 'Люба', number: 9, user: { id: 'lyba' }, role: Role.CITIZEN }),
  new Player({ nickname: 'Углическая', number: 10, user: { id: 'uglicheskaya' }, role: Role.CITIZEN }),
];
export const dummyHost = new Player({ nickname: 'Temoncher', user: { id: 'temoncher' }, role: Role.HOST });
