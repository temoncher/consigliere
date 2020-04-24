import { DayPhase } from '@shared/models/day-phase.enum';

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

export class SwitchDayPhase {
  static readonly type = '[Table.CurrentDay] Switch day phase';
  constructor(public dayPhase: DayPhase) { }
}

export class VoteForCandidate {
  static readonly type = '[Table.CurrentDay] Vote for candidate';
  constructor(
    public playerId: string,
    public proposedPlayerId: string,
  ) { }
}

export class StartNewDay {
  static readonly type = '[Table.CurrentDay] Start new day';
  constructor() { }
}

export class StartVote {
  static readonly type = '[Table.CurrentDay] Start vote';
  constructor() { }
}

export class ResetCurrentDayPlayerState {
  static readonly type = '[Table.CurrentDay] Reset current day player state';
  constructor(public playerId: string) { }
}

export class ShootPlayer {
  static readonly type = '[Table.CurrentDay] Shoot player';
  constructor(
    public mafiaId: string,
    public victimId: string,
  ) { }
}
