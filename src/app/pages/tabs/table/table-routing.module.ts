import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TableComponent } from './table.component';
import { PreparationFormComponent } from './preparation-form/preparation-form.component';

const routes: Routes = [
  {
    path: '',
    component: TableComponent,
  },
  {
    path: 'preparation',
    component: PreparationFormComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TableRoutingModule {}
