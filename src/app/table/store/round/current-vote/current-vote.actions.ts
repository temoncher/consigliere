
import { VotePhase } from '@/table/models/vote-phase.enum';
import { VoteResult } from '@/table/models/vote-result.enum';

import { roundActionsPrefix } from '../round.actions';

const voteActionsPrefix = `${roundActionsPrefix}.CurrentVote`;

export class SetVotes {
  static readonly type = `[${voteActionsPrefix}] Set votes`;
  constructor(public votes: Record<string, string[]>[]) { }
}

export class SetIsVoteDisabled {
  static readonly type = `[${voteActionsPrefix}] Check if this round's vote is disabled`;
  constructor(public isVoteDisabled: boolean) { }
}

export class VoteForCandidate {
  static readonly type = `[${voteActionsPrefix}] Vote for candidate`;
  constructor(
    public playerId: string,
    public proposedPlayerId: string,
  ) { }
}

export class SetPreviousLeadersIds {
  static readonly type = `[${voteActionsPrefix}] Set previous leaders ids`;
  constructor(public previousLeadersIds: string[]) { }
}

export class VoteForElimination {
  static readonly type = `[${voteActionsPrefix}] Vote for eliminate all`;
  constructor(public playerId: string) { }
}

export class SetCurrentVotePhase {
  static readonly type = `[${voteActionsPrefix}] Set current vote phase`;
  constructor(public currentPhase: VotePhase) { }
}

export class SetVoteResult {
  static readonly type = `[${voteActionsPrefix}] Set vote result`;
  constructor(public voteResult: VoteResult) { }
}

export class SetEliminateAllVote {
  static readonly type = `[${voteActionsPrefix}] Set eliminate all vote phase`;
  constructor(public eliminateAllVote: Map<string, boolean>) { }
}

export class DisableCurrentVote {
  static readonly type = `[${voteActionsPrefix}] Disable current vote`;
  constructor() { }
}
