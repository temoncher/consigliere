import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ScreenSizeGuard } from '@shared/guards/screen-size.guard';

import { ScreenSizeComponent } from './shared/components/guard-pages/screen-size.component';

const routes: Routes = [
  {
    path: 'screen-size',
    component: ScreenSizeComponent,
  },
  {
    path: '',
    canActivate: [ScreenSizeGuard],
    loadChildren: () => import('./pages/tabs/tabs.module').then((m) => m.TabsModule),
  },
  {
    path: 'login',
    canActivate: [ScreenSizeGuard],
    loadChildren: () => import('./pages/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'register',
    canActivate: [ScreenSizeGuard],
    loadChildren: () => import('./pages/login/login.module').then((m) => m.LoginModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
