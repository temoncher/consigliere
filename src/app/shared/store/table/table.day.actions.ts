export class StartNewDay {
  static readonly type = '[Table.Day] Start new day';
  constructor() { }
}

export class EndPlayerSpeech {
  static readonly type = '[Table.Day] End player speech';
  constructor(
    public playerId: string,
    public timeLeft: number,
    public proposedPlayerId: string,
  ) { }
}

export class VoteForCandidate {
  static readonly type = '[Table.Day] Vote for candidate';
  constructor(
    public playerIds: string[],
    public proposedPlayerId: string,
  ) { }
}
