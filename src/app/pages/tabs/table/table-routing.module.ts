import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TableComponent } from './table.component';

const routes: Routes = [
  {
    path: '',
    component: TableComponent,
  },
  {
    path: 'preparation',
    loadChildren: () => import('./preparation/preparation.module').then(m => m.PreparationModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TableRoutingModule {}
