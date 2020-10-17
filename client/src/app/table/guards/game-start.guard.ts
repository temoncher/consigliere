import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngxs/store';

import { TableState } from '@/table/store/table.state';

@Injectable({ providedIn: 'root' })
export class GameStartGuard implements CanActivate {
  constructor(
    private store: Store,
    private router: Router,
  ) { }

  canActivate() {
    const isGameStarted = this.store.selectSnapshot(TableState.getIsGameStarted);

    if (!isGameStarted) {
      return this.router.createUrlTree(['tabs', 'table']);
    }

    return true;
  }
}
