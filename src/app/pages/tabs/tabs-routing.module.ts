import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsComponent } from './tabs.component';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsComponent,
    children: [
      {
        path: 'clubs',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./clubs/clubs.module').then(m => m.ClubsComponentModule)
          }
        ]
      },
      {
        path: 'table',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./table/table.module').then(m => m.TableComponentModule)
          }
        ]
      },
      {
        path: 'profile',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./profile/profile.module').then(m => m.ProfileComponentModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/table',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/table',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsComponentRoutingModule {}
