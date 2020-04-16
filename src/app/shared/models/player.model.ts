import { User } from './user.model';
import { Role } from './role.enum';
import { QuitPhase } from './quit-phase.interface';

export class Player {
  nickname: string;
  number?: number;
  falls?: number;
  user?: User;
  isGuest?: boolean;
  role?: Role;
  quitPhase?: QuitPhase;

  constructor(player: any) {
    this.nickname = player.nickname;
    this.number = player.number;
    this.falls = player.falls;
    this.isGuest = player.isGuest;
    this.role = player.role;
    this.quitPhase = player.quitPhase;

    if (player.user?.id) {
      this.isGuest = false;
      this.user = player.user;
      return;
    }

    this.isGuest = true;
    this.user = {
      id: new Date().getTime().toString(),
    };
  }
}
