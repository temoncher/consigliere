import { Role } from './role.enum';
import { User } from './user.model';

export class Player {
  nickname: string;
  number?: number;
  user?: User;
  isGuest?: boolean;
  role?: Role;

  constructor(partialPlayer: Partial<Player>) {
    this.nickname = partialPlayer.nickname;
    this.number = partialPlayer.number;
    this.role = partialPlayer.role;

    if (partialPlayer.user?.id) {
      this.isGuest = false;
      this.user = partialPlayer.user;

      return;
    }

    this.isGuest = true;
    this.user = {
      id: new Date().getTime().toString(),
    };
  }
}
