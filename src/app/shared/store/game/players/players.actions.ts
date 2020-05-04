import { Player } from '@shared/models/player.model';

export class SetHost {
  static readonly type = '[Game.Players] Set host';
  constructor(public player: Player) { }
}
export class GiveRoles {
  static readonly type = '[Game.Players] Give roles';
  constructor() { }
}
export class AddPlayer {
  static readonly type = '[Game.Players] Add player';
  constructor(public player: Player) { }
}
export class RemovePlayer {
  static readonly type = '[Game.Players] Remove player';
  constructor(public userId: string) { }
}
export class KillPlayer {
  static readonly type = '[Game.Players] Kill player';
  constructor(public playerId: string) { }
}
export class ShufflePlayers {
  static readonly type = '[Game.Players] Shuffle players';
  constructor() { }
}
export class SetPlayersNumbers {
  static readonly type = '[Game.Players] Set players\' numbers';
  constructor() { }
}
export class AssignFall {
  static readonly type = '[Game.Players] Assign fall to a player';
  constructor(public playerId: string) { }
}

export class ResetPlayer {
  static readonly type = '[Game.Players] Reset player';
  constructor(public playerId: string) { }
}

export class ReorderPlayer {
  static readonly type = '[Game.Players] Reorder player';
  constructor(
    public previoustIndex: number,
    public newIndex: number,
  ) { }
}
