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
    loadChildren: () => import('./preparation/preparation.module').then(m => m.PreparationModule),
  },
  {
    path: 'game',
    loadChildren: () => import('./game/game.module').then(m => m.GameModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TableRoutingModule {}
