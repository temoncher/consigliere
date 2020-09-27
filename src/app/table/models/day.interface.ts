export interface Day {
  timers: Map<string, number>; // <playerId, timeLeft>
  proposedPlayers?: Map<string, string>; // <candidateId, playerId>
}
