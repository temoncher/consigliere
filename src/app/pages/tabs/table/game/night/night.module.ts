import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RoundProgressModule } from 'angular-svg-round-progressbar';

import { SharedModule } from '@shared/shared.module';
import { NightComponent } from './night.component';
import { MafiaHuntComponent } from './mafia-hunt/mafia-hunt.component';
import { GiveRolesComponent } from './give-roles/give-roles.component';
import { DonComponent } from './don/don.component';
import { SheriffComponent } from './sheriff/sheriff.component';

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
    GiveRolesComponent,
    DonComponent,
    SheriffComponent,
  ],
})
export class NightModule { }
