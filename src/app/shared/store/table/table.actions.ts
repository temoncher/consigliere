import { Player } from '@shared/models/player.model';

export class AddPlayer {
  static readonly type = '[Table] Add player';
  constructor(public player: Player) {}
}

export class RemovePlayer {
  static readonly type = '[Table] Remove player';
  constructor(public userId: string) {}
}
