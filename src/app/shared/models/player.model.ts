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
  disabledSpeechDayNumber?: number;

  constructor(partialPlayer: Partial<Player>) {
    this.nickname = partialPlayer.nickname;
    this.number = partialPlayer.number;
    this.falls = partialPlayer.falls || 0;
    this.role = partialPlayer.role;
    this.quitPhase = partialPlayer.quitPhase;
    this.disabledSpeechDayNumber = partialPlayer.disabledSpeechDayNumber;

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
