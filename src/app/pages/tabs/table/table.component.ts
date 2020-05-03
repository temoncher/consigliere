import { Component } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { StateReset } from 'ngxs-reset-plugin';
import { GameState } from '@shared/store/game/game.state';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-table',
  templateUrl: 'table.component.html',
  styleUrls: ['table.component.scss'],
})
export class TableComponent {
  @Select(GameState.getIsGameStarted) isGameStarted$: Observable<boolean>;

  constructor(private store: Store) { }

  resetGameState() {
    this.store.dispatch(new StateReset(GameState));
  }
}
