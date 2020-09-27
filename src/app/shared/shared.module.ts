import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireAuthGuardModule } from '@angular/fire/auth-guard';
import { IonicModule } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';
import { TranslateModule } from '@ngx-translate/core';

import { ExploreContainerComponent } from '@/shared/components/explore-container.component';

import { ScreenSizeComponent } from './components/guard-pages/screen-size.component';
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
    PortalComponent,
    ScreenSizeComponent,
    SmallPlayerCardComponent,
    TableTemplateComponent,
  ],
  exports: [
    ExploreContainerComponent,
    TranslateModule,
    PortalComponent,
    ScreenSizeComponent,
    SmallPlayerCardComponent,
    TableTemplateComponent,
  ],
})
export class SharedModule {}
