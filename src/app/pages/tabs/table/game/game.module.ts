import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '@shared/shared.module';
import { RouterModule } from '@angular/router';
import { RoundProgressModule } from 'angular-svg-round-progressbar';

import { GameComponent } from './game.component';
import { NightModalModule } from './night-modal/night-modal.module';
import { PlayerTimerComponent } from './player-timer/player-timer.component';
import { ProposeModalComponent } from './propose-modal/propose-modal.component';
import { VoteModalModule } from './vote-modal/vote-modal.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SharedModule,
    RouterModule.forChild([{ path: '', component: GameComponent }]),
    RoundProgressModule,
    NightModalModule,
    VoteModalModule,
  ],
  declarations: [
    GameComponent,
    PlayerTimerComponent,
    ProposeModalComponent,
  ],
})
export class GameModule { }
