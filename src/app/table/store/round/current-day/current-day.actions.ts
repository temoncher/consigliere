import { roundActionsPrefix } from '../round.actions';

const dayActionsPrefix = `${roundActionsPrefix}.CurrentDay`;

export class SetPlayerTimer {
  static readonly type = `[${dayActionsPrefix}] Set player timer`;
  constructor(
    public playerId: string,
    public timeElapsed: number,
  ) { }
}

export class ProposePlayer {
  static readonly type = `[${dayActionsPrefix}] Propose player`;
  constructor(
    public playerId: string,
    public candidateId: string,
  ) { }
}

export class WithdrawPlayer {
  static readonly type = `[${dayActionsPrefix}] Withdraw player`;
  constructor(public playerId: string) { }
}

export class ResetProposedPlayers {
  static readonly type = `[${dayActionsPrefix}] Reset proposed players`;
  constructor() { }
}

export class ResetPlayerTimer {
  static readonly type = `[${dayActionsPrefix}] Reset current day player timer`;
  constructor(public playerId: string) { }
}
