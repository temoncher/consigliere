import { RoundPhase } from '@/table/models/day-phase.enum';

import { gameActionsPrefix } from '../table.actions';

export const roundActionsPrefix = `${gameActionsPrefix}.Round`;

export class SwitchRoundPhase {
  static readonly type = `[${roundActionsPrefix}] Switch day phase`;
  constructor(public roundPhase: RoundPhase) { }
}

export class ResetKickedPlayer {
  static readonly type = `[${roundActionsPrefix}] Reset kick a player`;
  constructor(public playerId: string) { }
}

export class KickPlayer {
  static readonly type = `[${roundActionsPrefix}] Kick a player`;
  constructor(public playerId: string) { }
}
