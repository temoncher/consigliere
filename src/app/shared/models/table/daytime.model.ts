import { Voting } from './voting.model';

export class Daytime {
  timers: Map<string, number>; // <playerId, timeLeft>
  falls: Map<string, number>; // <playerId, number of falls>
  voting: Voting[]; // multiple votings can occur on ties
}
