import { Night } from './night.interface';
import { Day } from './day.interface';
import { Vote } from './vote.interface';

export class Round implements Night, Day, Vote {
  kickedPlayers: string[];
  // Night
  shots?: Map<string, string>; // <mafiaId, playerId>
  murderedPlayer?: string; // murdered player id
  donCheck?: string; // id of player checked by Don
  sheriffCheck?: string; // id of player checked by Sheriff

  // Day
  timers: Map<string, number>; // <playerId, timeLeft>
  proposedPlayers?: Map<string, string>; // <candidateId, playerId>

  // Vote
  isVoteDisabled = false;
  votes?: Map<string, string[]>[]; // <candidatePlayerId, votePlayerId[]>, multiple votes can occur on ties
  eliminateAllVote?: Map<string, boolean>;

  constructor(partialDay?: Partial<Round>) {
    this.kickedPlayers = partialDay?.kickedPlayers || [];

    this.shots = partialDay?.shots || new Map<string, string>();
    this.murderedPlayer = partialDay?.murderedPlayer;
    this.donCheck = partialDay?.donCheck;
    this.sheriffCheck = partialDay?.sheriffCheck;

    this.timers = partialDay?.timers || new Map<string, number>();
    this.proposedPlayers = partialDay?.proposedPlayers;

    this.isVoteDisabled = partialDay?.isVoteDisabled || false;
    this.votes = partialDay?.votes;
    this.eliminateAllVote = partialDay?.eliminateAllVote;
  }
}
