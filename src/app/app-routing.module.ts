import { NgModule } from '@angular/core';
import { AngularFireAuthGuard, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { ScreenSizeComponent } from '@/shared/components/guard-pages/screen-size.component';
import { ScreenSizeGuard } from '@/shared/guards/screen-size.guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['auth', 'login']);
const redirectAuthorizedToTable = () => redirectLoggedInTo(['tabs', 'table']);

const routes: Routes = [
  {
    path: 'screen-size',
    component: ScreenSizeComponent,
  },
  {
    path: 'auth',
    canActivate: [ScreenSizeGuard, AngularFireAuthGuard],
    data: { authGuardPipe: redirectAuthorizedToTable },
    loadChildren: () => import('@/auth/auth.module').then((m) => m.AppModule),
  },
  {
    path: '',
    canActivate: [ScreenSizeGuard, AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
    loadChildren: () => import('@/tabs/tabs.module').then((m) => m.TabsModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
