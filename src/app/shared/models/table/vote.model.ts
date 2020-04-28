import { VoteStage } from './vote-stage.model';

export class Vote {
    stages: VoteStage[];
    eliminateAllVote: Map<string, boolean>;

    constructor(partialVote?: Partial<Vote>) {
        this.stages = partialVote?.stages || [];
        this.eliminateAllVote = partialVote?.eliminateAllVote;
    }
}
