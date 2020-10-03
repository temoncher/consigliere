import { Player } from '@/shared/models/player.model';
import { IQuitPhase } from '@/shared/models/quit-phase.interface';
import { Role } from '@/shared/models/role.enum';

import { gameActionsPrefix } from '../table.actions';

const playersActionsPrefix = `${gameActionsPrefix}.Players`;

export class SetHost {
  static readonly type = `[${playersActionsPrefix}] Set host`;
  constructor(public player: Player) { }
}

export class GiveRoles {
  static readonly type = `[${playersActionsPrefix}] Give roles`;
  constructor() { }
}

export class AddPlayer {
  static readonly type = `[${playersActionsPrefix}] Add player`;
  constructor(public player: Player) { }
}

export class RemovePlayer {
  static readonly type = `[${playersActionsPrefix}] Remove player`;
  constructor(public userId: string) { }
}

export class KillPlayer {
  static readonly type = `[${playersActionsPrefix}] Kill player`;
  constructor(
    public playerId: string,
    public quitPhase: IQuitPhase,
  ) { }
}

export class ShufflePlayers {
  static readonly type = `[${playersActionsPrefix}] Shuffle players`;
  constructor() { }
}

export class SetPlayersNumbers {
  static readonly type = `[${playersActionsPrefix}] Set players' numbers`;
  constructor() { }
}

export class AssignFall {
  static readonly type = `[${playersActionsPrefix}] Assign fall to a player`;
  constructor(public playerId: string) { }
}

export class SkipSpeech {
  static readonly type = `[${playersActionsPrefix}] Skip speech of a player`;
  constructor(
    public playerId: string,
    public roundNumber: number,
  ) { }
}

export class ResetPlayer {
  static readonly type = `[${playersActionsPrefix}] Reset player`;
  constructor(public playerId: string) { }
}

export class ReorderPlayer {
  static readonly type = `[${playersActionsPrefix}] Reorder player`;
  constructor(
    public previoustIndex: number,
    public newIndex: number,
  ) { }
}

export class AssignRole {
  static readonly type = `[${playersActionsPrefix}] Assign role to player`;
  constructor(
    public playerId: string,
    public role: Role,
  ) { }
}