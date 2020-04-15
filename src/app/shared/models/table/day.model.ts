export class Day {
  kickedPlayer: string;
  // Night
  murderedPlayer: string; // murdered player id
  donCheck: string; // id of player checked by Don
  sheriffCheck: string; // id of player checked by Sheriff

  // Day
  timers: Map<string, number>; // <playerId, timeLeft>
  proposedPlayers: string[]; // playerIds
  votes: Map<string, string[]>[]; // <candidatePlayerId, votePlayerId[]>, multiple votes can occur on ties

  constructor(day?: any) {
    this.timers = day?.timers || new Map<string, number>();
    this.proposedPlayers = day?.proposedPlayers || [];
    this.votes = day?.votes || [];
    this.kickedPlayer = day?.kickedPlayer;
    this.murderedPlayer = day?.murderedPlayer;
    this.donCheck = day?.donCheck;
    this.sheriffCheck = day?.sheriffCheck;
  }
}
