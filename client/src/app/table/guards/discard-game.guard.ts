import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';

import { GameComponent } from '@/table/game/game.component';

@Injectable({ providedIn: 'root' })
export class DiscardGameGuard implements CanDeactivate<GameComponent> {
  canDeactivate(component: GameComponent) {
    return component.canDeactivate();
  }
}
