import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RoundProgressModule } from 'angular-svg-round-progressbar';

import { SharedModule } from '@shared/shared.module';
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
})
export class DayModule { }
