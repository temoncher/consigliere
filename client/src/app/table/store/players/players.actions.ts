
import { Player } from '@/shared/models/player.model';

import { gameActionsPrefix } from '../table.actions';

import { Role } from '~types/enums/role.enum';
import { IQuitPhase } from '~types/interfaces/quit-phase.interface';

const playersActionsPrefix = `${gameActionsPrefix}.Players`;

export class SetHost {
  static readonly type = `[${playersActionsPrefix}] Set host`;
  constructor(public player: Player) { }
}

export class GiveRoles {
  static readonly type = `[${playersActionsPrefix}] Give roles`;
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
}

export class SetPlayersNumbers {
  static readonly type = `[${playersActionsPrefix}] Set players' numbers`;
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
