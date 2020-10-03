import { ISerializable } from './serializable.interface';

export interface IPlayer {
  uid: string;
  nickname: string;
  number?: number;
  avatar?: string;
  isGuest: boolean;
}

export type ISerializedPlayer = Omit<IPlayer, 'avatar'>;

export type PlayerInput = Omit<IPlayer, 'isGuest' | 'uid'> & { uid?: string };

export class Player implements IPlayer, ISerializable<ISerializedPlayer> {
  uid: string;
  nickname: string;
  number?: number;
  avatar?: string;
  isGuest = false;

  constructor(player: PlayerInput) {
    this.nickname = player.nickname;

    if (this.avatar) {
      this.avatar = player.avatar;
    }

    if (typeof player.number !== 'undefined') {
      this.number = player.number;
    }

    if (player.uid) {
      this.uid = player.uid;
    } else {
      this.uid = Date.now().toString();
      this.isGuest = true;
    }
  }

  serialize(): ISerializedPlayer {
    const serializedPlayer: ISerializedPlayer = {
      nickname: this.nickname,
      uid: this.uid,
      isGuest: this.isGuest,
    };

    if (this.isGuest) {
      serializedPlayer.isGuest = this.isGuest;
    }

    if (typeof this.number !== 'undefined') {
      serializedPlayer.number = this.number;
    }

    return serializedPlayer;
  }
}
