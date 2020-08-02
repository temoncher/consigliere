import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireAuthGuardModule } from '@angular/fire/auth-guard';
import { IonicModule } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';
import { TranslateModule } from '@ngx-translate/core';

import { ExploreContainerComponent } from '@shared/components/explore-container/explore-container.component';
import { TimersService } from '@shared/services/timers.service';
import { LanguageService } from '@shared/services/language.service';
import { PlayersService } from '@shared/services/players.service';
import { GameService } from '@shared/services/game.service';
import { TableTemplateComponent } from './components/table-template/table-template.component';
import { SmallPlayerCardComponent } from './components/small-player-card/small-player-card.component';
import { PlayerControlsComponent } from './components/player-controls/player-controls.component';
import { ManagePlayerCardComponent } from './components/player-controls/manage-player-card/manage-player-card.component';
import { PlayerMenuComponent } from './components/player-controls/player-menu/player-menu.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    IonicStorageModule,
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
    TranslateModule,
  ],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [
        TimersService,
        LanguageService,
        PlayersService,
        GameService,
      ],
    };
  }
}
