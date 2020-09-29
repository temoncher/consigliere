export interface Day {
  timers: Record<string, number>; // <playerId, timeLeft>
  proposedPlayers?: Map<string, string>; // <candidateId, playerId>
}
