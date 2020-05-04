import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { GameState } from '@shared/store/game/game.state';

@Injectable({
  providedIn: 'root',
})
export class GameStartGuard implements CanActivate {
  constructor(
    private store: Store,
    private router: Router,
  ) { }

  canActivate() {
    const isGameStarted = this.store.selectSnapshot(GameState.getIsGameStarted);

    if (!isGameStarted) {
      return this.router.createUrlTree(['tabs', 'table']);
    }

    return true;
  }
}
