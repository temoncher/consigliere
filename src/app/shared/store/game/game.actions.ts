export const gameActionsPrefix = 'Game';

export class StartGame {
  static readonly type = `[${gameActionsPrefix}] Start game`;
  constructor() { }
}

export class ResetIsNextVotingDisabled {
  static readonly type = `[${gameActionsPrefix}] Reset next voting disabled`;
  constructor() { }
}

export class StartNewRound {
  static readonly type = `[${gameActionsPrefix}] Start new night`;
  constructor() { }
}

export class DisableVote {
  static readonly type = `[${gameActionsPrefix}] Disable vote`;
  constructor() { }
}

export class DropGame {
  static readonly type = `[${gameActionsPrefix}] Drop game`;
  constructor() { }
}
