import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GameStartGuard } from '@/table/guards/game-start.guard';

import { TableComponent } from './table.component';

const routes: Routes = [
  {
    path: '',
    component: TableComponent,
  },
  {
    path: 'preparation',
    canActivate: [GameStartGuard],
    loadChildren: () => import('@/table/preparation/preparation.module').then((m) => m.PreparationModule),
  },
  {
    path: 'game',
    canActivate: [GameStartGuard],
    loadChildren: () => import('@/table/game/game.module').then((m) => m.GameModule),
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
