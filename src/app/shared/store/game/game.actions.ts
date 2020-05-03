export class StartGame {
  static readonly type = '[Game] Start game';
  constructor() { }
}

export class ResetIsNextVotingDisabled {
  static readonly type = '[Game] Reset next voting disabled';
  constructor() { }
}

export class StartNight {
  static readonly type = '[Game] Start new night';
  constructor() { }
}

export class DisableNextVote {
  static readonly type = '[Game] Disable next vote';
  constructor() { }
}

export class DropGame {
  static readonly type = '[Game] Drop game';
  constructor() { }
}
