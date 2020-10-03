import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RoundProgressModule } from 'angular-svg-round-progressbar';

import { SharedModule } from '@/shared/shared.module';

import { DonComponent } from './don/don.component';
import { MafiaHuntComponent } from './mafia-hunt/mafia-hunt.component';
import { NightComponent } from './night.component';
import { SheriffComponent } from './sheriff/sheriff.component';
import { ZeroNightComponent } from './zero-night/zero-night.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SharedModule,
    RoundProgressModule,
  ],
  declarations: [
    NightComponent,
    MafiaHuntComponent,
    DonComponent,
    SheriffComponent,
    ZeroNightComponent,
  ],
  exports: [
    NightComponent,
  ],
})
export class NightModule { }
