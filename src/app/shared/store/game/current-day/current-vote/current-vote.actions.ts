import { VotePhase } from '@shared/models/table/vote-phase.enum';

export class StartVote {
    static readonly type = '[Game.CurrentDay.CurrentVote] Start vote';
    constructor(public proposedPlayers: string[]) { }
}

export class VoteForCandidate {
    static readonly type = '[Game.CurrentDay.CurrentVote] Vote for candidate';
    constructor(
        public playerId: string,
        public proposedPlayerId: string,
    ) { }
}

export class EndVoteStage {
    static readonly type = '[Game.CurrentDay.CurrentVote] End vote';
    constructor(public leadersIds: string[]) { }
}

export class SwitchVotePhase {
    static readonly type = '[Game.CurrentDay.CurrentVote] Switch vote phase';
    constructor(public newVotePhase: VotePhase) { }
}
