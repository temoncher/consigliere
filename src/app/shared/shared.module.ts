import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireAuthGuardModule } from '@angular/fire/auth-guard';
import { IonicModule } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';
import { TranslateModule } from '@ngx-translate/core';
import { ExploreContainerComponent } from '@shared/components/explore-container.component';
import { GameService } from '@shared/services/game.service';
import { LanguageService } from '@shared/services/language.service';
import { PlayersService } from '@shared/services/players.service';
import { TimersService } from '@shared/services/timers.service';

import { ScreenSizeComponent } from './components/guard-pages/screen-size.component';
import { ManagePlayerCardComponent } from './components/player-controls/manage-player-card/manage-player-card.component';
import { PlayerControlsComponent } from './components/player-controls/player-controls.component';
import { PlayerMenuComponent } from './components/player-controls/player-menu/player-menu.component';
import { PortalComponent } from './components/portal.component';
import { SmallPlayerCardComponent } from './components/small-player-card/small-player-card.component';
import { TableTemplateComponent } from './components/table-template/table-template.component';

@NgModule({
  imports: [
    PortalModule,
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
    PortalComponent,
    ScreenSizeComponent,
  ],
  exports: [
    ExploreContainerComponent,
    TableTemplateComponent,
    SmallPlayerCardComponent,
    PlayerControlsComponent,
    TranslateModule,
    PortalComponent,
    ScreenSizeComponent,
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
