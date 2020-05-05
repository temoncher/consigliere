import { VotePhase } from '@shared/models/table/vote-phase.enum';
import { roundActionsPrefix } from '../round.actions';

const voteActionsPrefix = `${roundActionsPrefix}.CurrentVote`;

export class StartVote {
    static readonly type = `[${voteActionsPrefix}] Start vote`;
    constructor(public proposedPlayers: string[]) { }
}

export class VoteForCandidate {
    static readonly type = `[${voteActionsPrefix}] Vote for candidate`;
    constructor(
        public playerId: string,
        public proposedPlayerId: string,
    ) { }
}

export class EndVoteStage {
    static readonly type = `[${voteActionsPrefix}] End vote`;
    constructor(public leadersIds: string[]) { }
}

export class SwitchVotePhase {
    static readonly type = `[${voteActionsPrefix}] Switch vote phase`;
    constructor(public newVotePhase: VotePhase) { }
}

export class DisableCurrentVote {
    static readonly type = `[${voteActionsPrefix}] Disable current vote`;
    constructor() { }
}

export class EndVote {
    static readonly type = `[${voteActionsPrefix}] End vote`;
    constructor() { }
}
