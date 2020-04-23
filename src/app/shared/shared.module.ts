import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { ExploreContainerComponent } from '@shared/components/explore-container/explore-container.component';
import { AuthService } from '@shared/services/auth.service';
import { TimersService } from '@shared/services/timers.service';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireAuthGuardModule } from '@angular/fire/auth-guard';
import { TableTemplateComponent } from './components/table-template/table-template.component';
import { SmallPlayerCardComponent } from './components/small-player-card/small-player-card.component';
import { PlayerControlsComponent } from './components/player-controls/player-controls.component';
import { ManagePlayerCardComponent } from './components/player-controls/manage-player-card/manage-player-card.component';
import { PlayerMenuComponent } from './components/player-controls/player-menu/player-menu.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    AngularFireAuthModule,
    AngularFireAuthGuardModule,
  ],
  declarations: [
    ExploreContainerComponent,
    TableTemplateComponent,
    SmallPlayerCardComponent,
    PlayerControlsComponent,
    ManagePlayerCardComponent,
    PlayerMenuComponent,
  ],
  exports: [
    ExploreContainerComponent,
    TableTemplateComponent,
    SmallPlayerCardComponent,
    PlayerControlsComponent,
  ],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [
        AuthService,
        TimersService,
      ],
    };
  }
}
