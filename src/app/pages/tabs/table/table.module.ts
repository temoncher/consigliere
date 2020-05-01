import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TableComponent } from './table.component';
import { TableRoutingModule } from './table-routing.module';
import { PreparationModule } from './preparation/preparation.module';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    SharedModule,
    TableRoutingModule,
    PreparationModule,
  ],
  declarations: [
    TableComponent,
  ],
})
export class TableModule { }
