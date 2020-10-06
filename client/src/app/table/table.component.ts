import { Component } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { StateReset } from 'ngxs-reset-plugin';
import { Observable } from 'rxjs';

import { consigliereLogo } from '@/shared/constants/avatars';

import { TableState } from './store/table.state';

@Component({
  selector: 'app-table',
  templateUrl: 'table.component.html',
  styleUrls: ['table.component.scss'],
})
export class TableComponent {
  @Select(TableState.getIsGameStarted) isGameStarted$: Observable<boolean>;

  consigliereLogo = consigliereLogo;

  constructor(private store: Store) { }

  resetGameState() {
    this.store.dispatch(new StateReset(TableState));
  }
}
