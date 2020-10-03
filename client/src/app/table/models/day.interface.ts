export interface IDay {
  timers?: Record<string, number>; // <playerId, timeElapsed>
  proposedPlayers?: Record<string, string>; // <candidateId, playerId>
}
