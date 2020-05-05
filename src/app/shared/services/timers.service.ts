import { Injectable } from '@angular/core';
import { Timer } from '@shared/models/table/timer.model';
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

  setTimer(playerId: string, time: number) {
    const playerTimer = this.timers.get(playerId);

    if (!playerTimer) {
      this.timers.set(playerId, new Timer({ time }));
      return;
    }

    playerTimer.resetTimer(time);
  }

  pauseAll() {
    for (const timer of this.timers.values()) {
      timer.pauseTimer();
    }
  }

  resetTimers() {
    const players = this.store.selectSnapshot((state: ApplicationStateModel) => state.game.players.players);
    const speechSkips = this.store.selectSnapshot((state: ApplicationStateModel) => state.game.players.speechSkips);
    const currentDayNumber = this.store.selectSnapshot((state: ApplicationStateModel) => state.game.rounds).length;

    this.pauseAll();

    for (const player of players) {
      const time = speechSkips.get(player.user.id) === currentDayNumber ? 0 : 60;
      this.timers.set(player.user.id, new Timer({ time }));
    }
  }

  resetPlayerTimer(playerId: string) {
    const speechSkips = this.store.selectSnapshot((state: ApplicationStateModel) => state.game.players.speechSkips);
    const currentDayNumber = this.store.selectSnapshot((state: ApplicationStateModel) => state.game.rounds).length;

    const time = speechSkips.get(playerId) === currentDayNumber ? 0 : 60;
    this.timers.get(playerId).resetTimer(time);
  }
}
