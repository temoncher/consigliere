import { User } from './user.model';

export class Player {
  nickname: string;
  user?: User;
  isGuest?: boolean;

  constructor(player) {
    this.nickname = player.nickname;
    this.user = player.user;
    this.isGuest = player.isGuest;
  }
}
