import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { SharedModule } from '@/shared/shared.module';

import { PreparationModule } from './preparation/preparation.module';
import { TableRoutingModule } from './table-routing.module';
import { TableComponent } from './table.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    SharedModule,
    TableRoutingModule,
    PreparationModule,
  ],
  declarations: [TableComponent],
})
export class TableModule { }
