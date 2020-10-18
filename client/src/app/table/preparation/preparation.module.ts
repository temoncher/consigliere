import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { SharedModule } from '@/shared/shared.module';

import { PlayerSuggestionsModalComponent } from './player-suggestions-modal/player-suggestions-modal.component';
import { PlayersListComponent } from './players-list/players-list.component';
import { RoleMenuComponent } from './players-list/role-menu.component';
import { PreparationComponent } from './preparation.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SharedModule,
    RouterModule.forChild([{
      path: '',
      component: PreparationComponent,
    }]),
  ],
  declarations: [
    PreparationComponent,
    PlayerSuggestionsModalComponent,
    PlayersListComponent,
    RoleMenuComponent,
  ],
})
export class PreparationModule { }
