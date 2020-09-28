import { Role } from './role.enum';
import { ISerializable } from './serializable.interface';
import { User } from './user.interface';

export interface IPlayer {
  nickname: string;
  number?: number;
  user?: User;
  isGuest?: boolean;
  role?: Role;
}

export class Player implements IPlayer, ISerializable<IPlayer> {
  nickname: string;
  number?: number;
  user?: User;
  isGuest?: boolean;
  role?: Role;

  constructor(partialPlayer: Partial<Player>) {
    this.nickname = partialPlayer.nickname;
    this.role = partialPlayer.role;

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

  serialize(exclude?: (keyof IPlayer)[]): IPlayer {
    /* eslint-disable no-param-reassign */
    const serializedPlayer = Object.entries(this)
      .reduce((player, [key, value]) => {
        const playerKey = key as keyof IPlayer;

        if (exclude?.includes(playerKey) || typeof value === 'undefined') return player;

        (player[playerKey] as any) = value;

        return player;
      }, {} as IPlayer);
    /* eslint-enable */

    return serializedPlayer;
  }
}
