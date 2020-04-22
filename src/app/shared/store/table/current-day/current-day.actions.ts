export class StopSpeech {
  static readonly type = '[Table.CurrentDay] Stop player speech';
  constructor(
    public playerId: string,
    public timeLeft: number,
  ) { }
}

export class ProposePlayer {
  static readonly type = '[Table.CurrentDay] Propose player';
  constructor(
    public playerId: string,
    public candidateId: string,
  ) { }
}

export class WithdrawPlayer {
  static readonly type = '[Table.CurrentDay] Withdraw player';
  constructor(public playerId: string) { }
}

export class KickPlayer {
  static readonly type = '[Table.CurrentDay] Kick a player';
  constructor(public playerId: string) { }
}

export class VoteForCandidate {
  static readonly type = '[Table.CurrentDay] Vote for candidate';
  constructor(
    public playerIds: string[],
    public proposedPlayerId: string,
  ) { }
}

export class StartNewDay {
  static readonly type = '[Table.CurrentDay] Start new day';
  constructor() { }
}
