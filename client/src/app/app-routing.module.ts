import { NgModule } from '@angular/core';
import { AngularFireAuthGuard, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { ScreenSizeComponent } from '@/shared/components/guard-pages/screen-size.component';
import { DesktopGuard } from '@/shared/guards/desktop.guard';
import { MobileGuard } from '@/shared/guards/mobile.guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['auth']);
const redirectAuthorizedToTable = () => redirectLoggedInTo(['tabs', 'table']);

const routes: Routes = [
  {
    path: 'screen-size',
    component: ScreenSizeComponent,
    canActivate: [MobileGuard],
  },
  {
    path: 'auth',
    canActivate: [DesktopGuard, AngularFireAuthGuard],
    data: { authGuardPipe: redirectAuthorizedToTable },
    loadChildren: () => import('@/auth/auth.module').then((m) => m.AppModule),
  },
  {
    path: '',
    canActivate: [DesktopGuard, AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
    loadChildren: () => import('@/tabs/tabs.module').then((m) => m.TabsModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
