import { Player } from '@shared/models/player.model';

export class SetHost {
  static readonly type = '[Table] Set host';
  constructor(public player: Player) {}
}
export class AddPlayer {
  static readonly type = '[Table] Add player';
  constructor(public player: Player) {}
}

export class RemovePlayer {
  static readonly type = '[Table] Remove player';
  constructor(public userId: string) {}
}
