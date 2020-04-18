import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { StateReset } from 'ngxs-reset-plugin';
import { TableState } from '@shared/store/table/table.state';

@Component({
  selector: 'app-table',
  templateUrl: 'table.component.html',
  styleUrls: ['table.component.scss'],
})
export class TableComponent {
  newGameText = 'Открыть стол';
  continueText = 'Продолжить';

  constructor(private store: Store) { }

  resetTableState() {
    this.store.dispatch(new StateReset(TableState));
  }
}
