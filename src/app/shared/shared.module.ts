import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExploreContainerComponent } from '@shared/components/explore-container/explore-container.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
  ],
  declarations: [
    ExploreContainerComponent,
  ],
  exports: [
    ExploreContainerComponent,
  ]
})
export class SharedModule { }
