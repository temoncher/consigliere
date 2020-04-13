export class Voting {
  candidates: Map<string, string[]>; // <candidatePlayerId, votePlayerId[]>

  get votedOutPlayer(): string {
    let maxVotes = 0;
    let votedOutPlayerId;

    for (const candidateId of this.candidates.keys()) {
      if (this.candidates[candidateId].length > maxVotes) {
        maxVotes = this.candidates[candidateId].length;
        votedOutPlayerId = candidateId;
      }
    }

    return votedOutPlayerId;
  }

  constructor(obj?: any) {
    this.candidates = obj.candidates;
  }

  toggleVote(playerId: string, candidateId: string) {
    const isAlreadyVotedForThisCandidate = this.candidates[candidateId].includes(playerId);
    this.filterPlayerId(playerId);

    if (!isAlreadyVotedForThisCandidate) {
      this.candidates[candidateId].push(playerId);
    }
  }

  private filterPlayerId(playerId: string) {
    for (const candidateId of this.candidates.keys()) {
      this.candidates[candidateId].filter((id: string) => id !== playerId);
    }
  }
}
