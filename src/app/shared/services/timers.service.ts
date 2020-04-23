import { Injectable } from '@angular/core';
import { Timer } from '@shared/models/timer.model';
import { Store } from '@ngxs/store';
import { ApplicationStateModel } from '@shared/store';

@Injectable({
  providedIn: 'root',
})
export class TimersService {
  timers = new Map<string, Timer>();

  constructor(private store: Store) { }

  getPlayerTimer(playerId: string) {
    return this.timers.get(playerId);
  }

  resetTimers() {
    const players = this.store.selectSnapshot((state: ApplicationStateModel) => state.table.players.players);

    for (const player of players) {
      this.timers.set(player.user.id, new Timer({ time: player.nextSpeechTime }));
    }
  }

  resetPlayerTimer(playerId: string) {
    const players = this.store.selectSnapshot((state: ApplicationStateModel) => state.table.players.players);
    const foundPlayer = players.find((player) => player.user.id === playerId);

    this.timers.get(playerId).resetTimer(foundPlayer.nextSpeechTime);
  }
}
