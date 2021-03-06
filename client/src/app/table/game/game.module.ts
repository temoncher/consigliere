import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { SharedModule } from '@/shared/shared.module';
import { DiscardGameGuard } from '@/table/guards/discard-game.guard';

import { DayModule } from './day/day.module';
import { GameMenuComponent } from './game-menu/game-menu.component';
import { GameComponent } from './game.component';
import { NightModule } from './night/night.module';
import { PlayerControlsModule } from './player-controls/player-controls.module';
import { ResultListComponent } from './result/result-list/result-list.component';
import { ResultComponent } from './result/result.component';
import { VoteModule } from './vote/vote.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SharedModule,
    PlayerControlsModule,
    DayModule,
    NightModule,
    VoteModule,
    RouterModule.forChild([{
      path: '',
      component: GameComponent,
      canDeactivate: [DiscardGameGuard],
    }]),
  ],
  declarations: [
    GameComponent,
    GameMenuComponent,
    ResultComponent,
    ResultListComponent,
  ],
})
export class GameModule { }
