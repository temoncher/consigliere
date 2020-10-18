import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Navigate } from '@ngxs/router-plugin';
import { Store, Select } from '@ngxs/store';
import { StateReset } from 'ngxs-reset-plugin';
import { Observable } from 'rxjs';

import { consigliereLogo } from '@/shared/constants/avatars';

import { PreparationModalComponent } from './preparation-modal/preparation-modal.component';
import { SetTableMeta } from './store/table.actions';
import { TableState } from './store/table.state';

@Component({
  selector: 'app-table',
  templateUrl: 'table.component.html',
  styleUrls: ['table.component.scss'],
})
export class TableComponent {
  @Select(TableState.getIsGameStarted) isGameStarted$: Observable<boolean>;

  consigliereLogo = consigliereLogo;

  constructor(
    private store: Store,
    private modalController: ModalController,
    private activatedRoute: ActivatedRoute,
  ) { }

  async presentPreparationModal(): Promise<void> {
    this.store.dispatch(new StateReset(TableState));

    const modal = await this.modalController.create({
      component: PreparationModalComponent,
      swipeToClose: true,
    });

    await modal.present();

    const { data: tableMeta, role } = await modal.onWillDismiss();

    if (role === 'start') {
      this.store.dispatch([
        new SetTableMeta({ ...tableMeta, isGameStarted: true }),
        new Navigate(['preparation'], undefined, { relativeTo: this.activatedRoute }),
      ]);
    }
  }
}
