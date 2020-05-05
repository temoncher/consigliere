import { roundActionsPrefix } from '../round.actions';

const dayActionsPrefix = `${roundActionsPrefix}.CurrentDay`;

export class StopSpeech {
  static readonly type = `[${dayActionsPrefix}] Stop player speech`;
  constructor(public playerId: string) { }
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

export class EndDay {
  static readonly type = `[${dayActionsPrefix}] End day`;
  constructor() { }
}
