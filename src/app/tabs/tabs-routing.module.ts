import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TabsComponent } from './tabs.component';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsComponent,
    children: [
      {
        path: 'search',
        loadChildren: () => import('@/search/search.module').then((m) => m.SearchModule),
      },
      {
        path: 'clubs',
        loadChildren: () => import('@/clubs/clubs.module').then((m) => m.ClubsModule),
      },
      {
        path: 'table',
        loadChildren: () => import('@/table/table.module').then((m) => m.TableModule),
      },
      {
        path: 'profile',
        loadChildren: () => import('@/profile/profile.module').then((m) => m.ProfileModule),
      },
      {
        path: '',
        redirectTo: '/tabs/table',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/table',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsRoutingModule {}
