import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '@shared/shared.module';
import { RoundProgressModule } from 'angular-svg-round-progressbar';

import { DayComponent } from './day.component';
import { PlayerTimerComponent } from './player-timer/player-timer.component';
import { ProposeModalComponent } from './propose-modal/propose-modal.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SharedModule,
    RoundProgressModule,
  ],
  declarations: [
    DayComponent,
    PlayerTimerComponent,
    ProposeModalComponent,
  ],
  exports: [
    DayComponent,
  ],
})
export class DayModule { }
