import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';
import { SharedModule } from '@shared/shared.module';
import { PreparationComponent } from './preparation.component';
import { PreparationModalComponent } from './preparation-modal/preparation-modal.component';
import { PlayersListComponent } from './players-list/players-list.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SharedModule,
  ],
  declarations: [
    PreparationComponent,
    PreparationModalComponent,
    PlayersListComponent,
  ],
})
export class PreparationModule { }
