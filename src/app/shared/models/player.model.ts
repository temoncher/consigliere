import { User } from './user.model';
import { Role } from './role.enum';

export class Player {
  nickname: string;
  user?: User;
  isGuest?: boolean;
  role?: Role;
  isDead?: boolean;

  constructor(player) {
    this.nickname = player.nickname;
    this.user = player.user;
    this.isGuest = player.isGuest;
    this.role = player.role;
    this.isDead = player.isDead;
  }
}
