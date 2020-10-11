import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { SharedModule } from '@/shared/shared.module';

import { ManagePlayerCardComponent } from './manage-player-card.component';
import { PlayerControlsComponent } from './player-controls.component';
import { PlayerMenuComponent } from './player-menu.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SharedModule,
  ],
  declarations: [
    ManagePlayerCardComponent,
    PlayerMenuComponent,
    PlayerControlsComponent,
  ],
  exports: [PlayerControlsComponent],
})
export class PlayerControlsModule { }
