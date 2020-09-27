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

    if (partialPlayer.user?.uid) {
      this.isGuest = false;
      this.user = partialPlayer.user;

      return;
    }

    this.isGuest = true;
    this.user = {
      uid: new Date().getTime().toString(),
      nickname: partialPlayer.nickname,
    };
  }
}
