import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GameComponent } from './game.component';
import { NightComponent } from './night/night.component';
import { DayComponent } from './day/day.component';
import { VoteComponent } from './vote/vote.component';
import { ResultComponent } from './result/result.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '0',
    pathMatch: 'full',
  },
  {
    path: 'result',
    component: ResultComponent,
  },
  {
    path: ':roundNumber',
    component: GameComponent,
    children: [
      {
        path: 'night',
        component: NightComponent,
      },
      {
        path: 'day',
        component: DayComponent,
      },
      {
        path: 'vote',
        component: VoteComponent,
      },
      {
        path: '',
        redirectTo: 'night',
        pathMatch: 'full',
      },
      {
        path: '**',
        redirectTo: '',
      },
    ],
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
export class GameRoutingModule { }
