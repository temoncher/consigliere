import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { PreparationComponent } from './preparation.component';
import { PreparationModalComponent } from './preparation-modal/preparation-modal.component';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SharedModule,
    RouterModule.forChild([{ path: '', component: PreparationComponent }])
  ],
  declarations: [
    PreparationComponent,
    PreparationModalComponent,
  ],
  entryComponents: [
    PreparationModalComponent
  ]
})
export class PreparationModule { }
