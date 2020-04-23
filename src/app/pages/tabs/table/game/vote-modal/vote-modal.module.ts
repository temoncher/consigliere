import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { SharedModule } from '@shared/shared.module';
import { VoteModalComponent } from './vote-modal.component';
import { VoteStageComponent } from './vote-stage/vote-stage.component';
@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SharedModule,
  ],
  declarations: [
    VoteModalComponent,
    VoteStageComponent,
  ],
})
export class VoteModalModule { }
