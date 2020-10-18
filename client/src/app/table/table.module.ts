import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { SharedModule } from '@/shared/shared.module';

import { ClubSuggestionsModalComponent } from './preparation-modal/club-suggestions-modal/club-suggestions-modal.component';
import { PreparationModalComponent } from './preparation-modal/preparation-modal.component';
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
    ReactiveFormsModule,
  ],
  declarations: [
    TableComponent,
    PreparationModalComponent,
    ClubSuggestionsModalComponent,
  ],
})
export class TableModule { }
