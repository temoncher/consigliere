import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ClubsComponent } from './clubs.component';
import { ExploreContainerComponentModule } from '@shared/components/explore-container/explore-container.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    RouterModule.forChild([{ path: '', component: ClubsComponent }])
  ],
  declarations: [ClubsComponent]
})
export class ClubsComponentModule {}
