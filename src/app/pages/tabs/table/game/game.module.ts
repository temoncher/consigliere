import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '@shared/shared.module';
import { RoundProgressModule } from 'angular-svg-round-progressbar';

import { GameComponent } from './game.component';
import { GameRoutingModule } from './game-routing.module';
import { DayModule } from './day/day.module';
import { NightModule } from './night/night.module';
import { VoteModule } from './vote/vote.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SharedModule,
    RoundProgressModule,
    DayModule,
    NightModule,
    VoteModule,
    GameRoutingModule,
  ],
  declarations: [
    GameComponent,
  ],
})
export class GameModule { }
