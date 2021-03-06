
import { GameResult } from '@/graphql/gql.generated';
import { IRound } from '@/table/models/round.interface';

export const gameActionsPrefix = 'Game';

export class ResetIsNextVotingDisabled {
  static readonly type = `[${gameActionsPrefix}] Reset next voting disabled`;
}

export class AddRound {
  static readonly type = `[${gameActionsPrefix}] Add round`;
  constructor(public round: IRound) { }
}

export class SetIsNextVotingDisabled {
  static readonly type = `[${gameActionsPrefix}] Set next voting disabling condition`;
  constructor(public isNextVotingDisabled: boolean) { }
}

export class SetTableMeta {
  static readonly type = `[${gameActionsPrefix}] Set next voting disabling condition`;
  constructor(public tableMeta: {
    title: string;
    date: string;
    club?: string;
    isGameStarted: true;
  }) { }
}

export class EndGame {
  static readonly type = `[${gameActionsPrefix}] End game`;
  constructor(public gameResult: GameResult) { }
}
