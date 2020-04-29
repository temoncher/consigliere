import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TableComponent } from './table.component';
import { PreparationComponent } from './preparation/preparation.component';

const routes: Routes = [
  {
    path: '',
    component: TableComponent,
  },
  {
    path: 'preparation',
    component: PreparationComponent,
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
export class TableRoutingModule { }
