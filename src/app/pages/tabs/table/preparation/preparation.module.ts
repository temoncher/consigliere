import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { PreparationComponent } from './preparation.component';
import { PreparationModalComponent } from './preparation-modal/preparation-modal.component';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '@shared/shared.module';
import { PlayersListComponent } from './players-list/players-list.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SharedModule,
    RouterModule.forChild([{ path: '', component: PreparationComponent }]),
  ],
  declarations: [
    PreparationComponent,
    PreparationModalComponent,
    PlayersListComponent,
  ],
})
export class PreparationModule { }
