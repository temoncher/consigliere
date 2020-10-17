
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';

import { Timer } from '../models/timer.model';
import { PlayersState } from '../store/players/players.state';
import { TableState } from '../store/table.state';

@Injectable({ providedIn: 'root' })
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
    const players = this.store.selectSnapshot(PlayersState.getPlayers);
    const speechSkips = this.store.selectSnapshot(PlayersState.getSpeechSkips);
    const currentRoundNumber = this.store.selectSnapshot(TableState.getRoundNumber);

    this.pauseAll();

    for (const player of players) {
      const time = speechSkips[player.uid] === currentRoundNumber ? 0 : 60;

      this.timers.set(player.uid, new Timer({ time }));
    }
  }

  resetPlayerTimer(playerId: string) {
    const speechSkips = this.store.selectSnapshot(PlayersState.getSpeechSkips);
    const currentRoundNumber = this.store.selectSnapshot(TableState.getRoundNumber);

    const time = speechSkips[playerId] === currentRoundNumber ? 0 : 60;

    this.timers.get(playerId).resetTimer(time);
  }
}
