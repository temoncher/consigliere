import { Vote } from './vote.model';

export class Day {
  kickedPlayers: string[];
  isVoteDisabled = false;
  // Night
  shots: Map<string, string>; // <mafiaId, playerId>
  murderedPlayer: string; // murdered player id
  donCheck: string; // id of player checked by Don
  sheriffCheck: string; // id of player checked by Sheriff

  // Day
  timers: Map<string, number>; // <playerId, timeLeft>
  vote: Vote; // <candidatePlayerId, votePlayerId[]>, multiple votes can occur on ties

  constructor(partialDay?: Partial<Day>) {
    this.kickedPlayers = partialDay?.kickedPlayers || [];
    this.isVoteDisabled = partialDay?.isVoteDisabled || false;

    this.shots = partialDay?.shots || new Map<string, string>();
    this.murderedPlayer = partialDay?.murderedPlayer;
    this.donCheck = partialDay?.donCheck;
    this.sheriffCheck = partialDay?.sheriffCheck;

    this.timers = partialDay?.timers || new Map<string, number>();
    this.vote = partialDay?.vote;
  }
}
