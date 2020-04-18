export class StartNewDay {
  static readonly type = '[Table.Day] Start new day';
  constructor() { }
}

export class StopSpeech {
  static readonly type = '[Table.Day] Stop player speech';
  constructor(
    public playerId: string,
    public timeLeft: number,
  ) { }
}

export class ProposePlayer {
  static readonly type = '[Table.Day] Propose player';
  constructor(
    public playerId: string,
    public candidateId: string,
  ) { }
}
export class WithdrawPlayer {
  static readonly type = '[Table.Day] Withdraw player';
  constructor(public playerId: string) { }
}

export class VoteForCandidate {
  static readonly type = '[Table.Day] Vote for candidate';
  constructor(
    public playerIds: string[],
    public proposedPlayerId: string,
  ) { }
}

export class ResetPlayer {
  static readonly type = '[Table.Day] Reset player';
  constructor(public playerId: string) { }
}
