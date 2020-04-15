import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '@shared/shared.module';
import { RouterModule } from '@angular/router';
import { RoundProgressModule } from 'angular-svg-round-progressbar';

import { GameComponent } from './game.component';
import { PlayerCardComponent } from './player-card/player-card.component';
import { PlayerMenuComponent } from './player-menu/player-menu.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SharedModule,
    RouterModule.forChild([{ path: '', component: GameComponent }]),
    RoundProgressModule,
  ],
  declarations: [
    GameComponent,
    PlayerCardComponent,
    PlayerMenuComponent
  ],
})
export class GameModule { }
