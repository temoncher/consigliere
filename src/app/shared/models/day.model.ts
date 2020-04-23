export class Day {
  kickedPlayers: string[];
  // Night
  shots: Map<string, string>; // <mafiaId, playerId>
  murderedPlayer: string; // murdered player id
  donCheck: string; // id of player checked by Don
  sheriffCheck: string; // id of player checked by Sheriff

  // Day
  timers: Map<string, number>; // <playerId, timeLeft>
  votes: Map<string, string[]>[]; // <candidatePlayerId, votePlayerId[]>, multiple votes can occur on ties

  constructor(day?: any) {
    this.kickedPlayers = day?.kickedPlayers || [];

    this.shots = day?.shots || new Map<string, string>();
    this.murderedPlayer = day?.murderedPlayer;
    this.donCheck = day?.donCheck;
    this.sheriffCheck = day?.sheriffCheck;

    this.timers = day?.timers || new Map<string, number>();
    this.votes = day?.votes || new Map<string, string[]>();
  }
}
