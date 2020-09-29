export interface IDay {
  timers: Record<string, number>; // <playerId, timeLeft>
  proposedPlayers?: Record<string, string>; // <candidateId, playerId>
}
