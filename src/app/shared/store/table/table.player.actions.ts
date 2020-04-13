import { Player } from '@shared/models/player.model';

export class SetHost {
  static readonly type = '[Table.Player] Set host';
  constructor(public player: Player) {}
}
export class GiveRoles {
  static readonly type = '[Table.Player] Give roles';
  constructor() {}
}
export class AddPlayer {
  static readonly type = '[Table.Player] Add player';
  constructor(public player: Player) {}
}
export class RemovePlayer {
  static readonly type = '[Table.Player] Remove player';
  constructor(public userId: string) {}
}
export class ShufflePlayers {
  static readonly type = '[Table.Player] Shuffle players';
  constructor() {}
}
