import { ISerializable } from './serializable.interface';
import { User } from './user.interface';

export interface IPlayer {
  nickname: string;
  number?: number;
  user?: User;
  isGuest?: boolean;
}

export interface ISerializedPlayer extends Omit<IPlayer, 'user' | 'nickname'> {
  nickname?: string;
  user?: string;
}

export class Player implements IPlayer, ISerializable<ISerializedPlayer> {
  nickname: string;
  number?: number;
  user?: User;
  isGuest?: boolean;

  constructor(partialPlayer: Partial<Player>) {
    this.nickname = partialPlayer.nickname;

    if (partialPlayer.number) {
      this.number = partialPlayer.number;
    }

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

  serialize(exclude?: (keyof ISerializedPlayer)[]): ISerializedPlayer {
    if (!this.isGuest) {
      const serializedPlayer: ISerializedPlayer = {};

      if (!exclude?.includes('user')) {
        serializedPlayer.user = this.user.uid;
      }

      return serializedPlayer;
    }

    /* eslint-disable no-param-reassign */
    const serializedPlayer = Object.entries(this)
      .reduce((player, [key, value]) => {
        const playerKey = key as keyof ISerializedPlayer;

        if (exclude?.includes(playerKey) || typeof value === 'undefined') return player;

        if (playerKey !== 'user' && playerKey !== 'isGuest') {
          (player[playerKey] as any) = value;
        }

        return player;
      }, {} as ISerializedPlayer);
    /* eslint-enable */

    return serializedPlayer;
  }
}
