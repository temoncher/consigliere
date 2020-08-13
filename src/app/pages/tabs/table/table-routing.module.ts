import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GameStartGuard } from '@shared/guards/game-start.guard';
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
    canActivate: [GameStartGuard],
    loadChildren: () => import('./game/game.module').then((m) => m.GameModule),
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TableRoutingModule { }
