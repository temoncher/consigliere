import { Player } from '@shared/models/player.model';

export class SetHost {
  static readonly type = '[Table.Players] Set host';
  constructor(public player: Player) { }
}
export class GiveRoles {
  static readonly type = '[Table.Players] Give roles';
  constructor() { }
}
export class AddPlayer {
  static readonly type = '[Table.Players] Add player';
  constructor(public player: Player) { }
}
export class RemovePlayer {
  static readonly type = '[Table.Players] Remove player';
  constructor(public userId: string) { }
}
export class KillPlayer {
  static readonly type = '[Table.Players] Kill player';
  constructor(public playerId: string) { }
}
export class ShufflePlayers {
  static readonly type = '[Table.Players] Shuffle players';
  constructor() { }
}
export class AssignFall {
  static readonly type = '[Table.Players] Assign fall to a player';
  constructor(public playerId: string) { }
}
