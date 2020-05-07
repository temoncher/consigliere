import { VotePhase } from '@shared/models/table/vote-phase.enum';
import { roundActionsPrefix } from '../round.actions';
import { VoteResult } from '@shared/models/table/vote-result.enum';

const voteActionsPrefix = `${roundActionsPrefix}.CurrentVote`;

export class StartVote {
    static readonly type = `[${voteActionsPrefix}] Start vote`;
    constructor(public proposedPlayers: string[]) { }
}

export class SetIsVoteDisabled {
    static readonly type = `[${voteActionsPrefix}] Check if this round's vote is disabled`;
    constructor() { }
}

export class VoteForCandidate {
    static readonly type = `[${voteActionsPrefix}] Vote for candidate`;
    constructor(
        public playerId: string,
        public proposedPlayerId: string,
    ) { }
}

export class EndVoteStage {
    static readonly type = `[${voteActionsPrefix}] End vote stage`;
    constructor() { }
}

export class EndAdditionalSpeech {
    static readonly type = `[${voteActionsPrefix}] End additional speech`;
    constructor() { }
}

export class EndEliminateVote {
    static readonly type = `[${voteActionsPrefix}] End eliminate vote`;
    constructor() { }
}

export class VoteForEliminateAll {
    static readonly type = `[${voteActionsPrefix}] Vote for eliminate all`;
    constructor(public playerId: string) { }
}

export class SwitchVotePhase {
    static readonly type = `[${voteActionsPrefix}] Switch vote phase`;
    constructor(public newVotePhase: VotePhase) { }
}

export class SwitchVoteResult {
    static readonly type = `[${voteActionsPrefix}] Switch vote result`;
    constructor(public voteResult: VoteResult) { }
}

export class DisableCurrentVote {
    static readonly type = `[${voteActionsPrefix}] Disable current vote`;
    constructor() { }
}

export class EndVote {
    static readonly type = `[${voteActionsPrefix}] End vote`;
    constructor() { }
}
