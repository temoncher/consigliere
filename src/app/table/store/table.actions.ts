import { GameResult } from '@/table/models/game-result.enum';
import { IRound } from '@/table/models/round.interface';

export const gameActionsPrefix = 'Game';

export class SetIsGameStarted {
  static readonly type = `[${gameActionsPrefix}] Set game started flag`;
  constructor(public isGameStarted: boolean) { }
}

export class ResetIsNextVotingDisabled {
  static readonly type = `[${gameActionsPrefix}] Reset next voting disabled`;
  constructor() { }
}

export class AddRound {
  static readonly type = `[${gameActionsPrefix}] Add round`;
  constructor(public round: IRound) { }
}

export class SetIsNextVotingDisabled {
  static readonly type = `[${gameActionsPrefix}] Set next voting disabling condition`;
  constructor(public isNextVotingDisabled: boolean) { }
}

export class EndGame {
  static readonly type = `[${gameActionsPrefix}] End game`;
  constructor(public gameResult: GameResult) { }
}
