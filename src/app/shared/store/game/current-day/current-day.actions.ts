import { DayPhase } from '@shared/models/table/day-phase.enum';

export class StopSpeech {
  static readonly type = '[Game.CurrentDay] Stop player speech';
  constructor(public playerId: string) { }
}

export class ProposePlayer {
  static readonly type = '[Game.CurrentDay] Propose player';
  constructor(
    public playerId: string,
    public candidateId: string,
  ) { }
}

export class WithdrawPlayer {
  static readonly type = '[Game.CurrentDay] Withdraw player';
  constructor(public playerId: string) { }
}

export class KickPlayer {
  static readonly type = '[Game.CurrentDay] Kick a player';
  constructor(public playerId: string) { }
}

export class SwitchDayPhase {
  static readonly type = '[Game.CurrentDay] Switch day phase';
  constructor(public dayPhase: DayPhase) { }
}

export class EndDay {
  static readonly type = '[Game.CurrentDay] End day';
  constructor() { }
}

export class EndVote {
  static readonly type = '[Game.CurrentDay] End vote';
  constructor() { }
}

export class ResetCurrentDayPlayerState {
  static readonly type = '[Game.CurrentDay] Reset current day player state';
  constructor(public playerId: string) { }
}

export class ShootPlayer {
  static readonly type = '[Game.CurrentDay] Shoot player';
  constructor(
    public mafiaId: string,
    public victimId: string,
  ) { }
}

export class DisableVote {
  static readonly type = '[Game.CurrentDay] Disable vote';
  constructor() { }
}
