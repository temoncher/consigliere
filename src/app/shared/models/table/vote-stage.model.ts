export class VoteStage {
    votes: Map<string, string[]>;
    timers: Map<string, number>;

    constructor(partialVoteStage?: Partial<VoteStage>) {
        this.votes = partialVoteStage?.votes || new Map<string, string[]>();
        this.timers = partialVoteStage?.timers || new Map<string, number>();
    }
}
