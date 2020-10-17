import { ISerializable } from './serializable.interface';

export interface IPlayer {
  uid: string;
  nickname: string;
  number?: number;
  avatar?: string;
  isGuest: boolean;
}

export type ISerializedPlayer = Omit<IPlayer, 'avatar'>;

export type PlayerInput = Omit<IPlayer, 'isGuest' | 'uid'> & {
  isGuest?: boolean;
  uid?: string;
};

export class Player implements IPlayer, ISerializable<ISerializedPlayer> {
  uid: string;
  nickname: string;
  number?: number;
  avatar?: string;
  isGuest: boolean;

  constructor(player: PlayerInput) {
    this.nickname = player.nickname;

    if (this.avatar) {
      this.avatar = player.avatar;
    }

    if (player.number !== undefined) {
      this.number = player.number;
    }

    this.isGuest = player.isGuest === undefined || this.isGuest;
    this.uid = player.uid || Date.now().toString();
  }

  serialize(): ISerializedPlayer {
    const serializedPlayer: ISerializedPlayer = {
      nickname: this.nickname,
      uid: this.uid,
      isGuest: this.isGuest,
    };

    if (this.number !== undefined) {
      serializedPlayer.number = this.number;
    }

    return serializedPlayer;
  }
}
