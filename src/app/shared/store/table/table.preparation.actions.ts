import { Player } from '@shared/models/player.model';

export class SetHost {
  static readonly type = '[Table.Preparation] Set host';
  constructor(public player: Player) { }
}
export class GiveRoles {
  static readonly type = '[Table.Preparation] Give roles';
  constructor() { }
}
export class AddPlayer {
  static readonly type = '[Table.Preparation] Add player';
  constructor(public player: Player) { }
}
export class RemovePlayer {
  static readonly type = '[Table.Preparation] Remove player';
  constructor(public userId: string) { }
}
export class ShufflePlayers {
  static readonly type = '[Table.Preparation] Shuffle players';
  constructor() { }
}
export class ResetTable {
  static readonly type = '[Table.Preparation] Reset table';
  constructor() { }
}
