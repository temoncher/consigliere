import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TableComponent } from './table.component';
import { ExploreContainerComponentModule } from '@shared/components/explore-container/explore-container.module';
import { TableRoutingModule } from './table-routing.module';
import { PreparationFormComponent } from './preparation-form/preparation-form.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    TableRoutingModule,
  ],
  declarations: [
    TableComponent,
    PreparationFormComponent,
  ]
})
export class TableModule {}
