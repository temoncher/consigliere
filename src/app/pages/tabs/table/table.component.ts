import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { StateReset } from 'ngxs-reset-plugin';
import { GameState } from '@shared/store/game/game.state';

@Component({
  selector: 'app-table',
  templateUrl: 'table.component.html',
  styleUrls: ['table.component.scss'],
})
export class TableComponent {
  newGameText = 'Открыть стол';
  continueText = 'Продолжить';

  constructor(private store: Store) { }

  resetGameState() {
    this.store.dispatch(new StateReset(GameState));
  }
}
