import { User } from './user.model';
import { Role } from './role.enum';

export class Player {
  nickname: string;
  number?: number;
  user?: User;
  isGuest?: boolean;
  role?: Role;
  isDead?: boolean;

  constructor(player: any) {
    this.nickname = player.nickname;
    this.number = player.number;
    this.user = player.user;
    this.isGuest = player.isGuest;
    this.role = player.role;
    this.isDead = player.isDead;
  }
}
