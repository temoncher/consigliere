import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RoundProgressModule } from 'angular-svg-round-progressbar';

import { SharedModule } from '@shared/shared.module';
import { NightModalComponent } from './night-modal.component';
import { MafiaHuntComponent } from './mafia-hunt/mafia-hunt.component';
import { GiveRolesComponent } from './give-roles/give-roles.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SharedModule,
    RoundProgressModule,
  ],
  declarations: [
    NightModalComponent,
    MafiaHuntComponent,
    GiveRolesComponent,
  ],
})
export class NightModalModule { }
