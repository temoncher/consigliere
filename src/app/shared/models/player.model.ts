import { User } from './user.model';

export class Player {
  nickname: string;
  user?: User;

  constructor(player) {
    this.nickname = player.nickname;
    this.user = player.user;
  }
}
