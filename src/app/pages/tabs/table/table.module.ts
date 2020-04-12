import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TableComponent } from './table.component';
import { TableRoutingModule } from './table-routing.module';
import { PreparationModule } from './preparation/preparation.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    PreparationModule,
    TableRoutingModule,
  ],
  declarations: [
    TableComponent,
  ]
})
export class TableModule {}
