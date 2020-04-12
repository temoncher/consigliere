import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { ExploreContainerComponent } from '@shared/components/explore-container/explore-container.component';
import { AuthService } from '@shared/services/auth.service';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireAuthGuardModule } from '@angular/fire/auth-guard';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    AngularFireAuthModule,
    AngularFireAuthGuardModule,
  ],
  declarations: [
    ExploreContainerComponent,
  ],
  exports: [
    ExploreContainerComponent,
  ]
})
export class SharedModule {
  static forRoot() {
    return {
      ngModule: SharedModule,
      providers: [AuthService]
    };
  }
}
