import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { NgxsModule } from '@ngxs/store';
import { NgxsResetPluginModule } from 'ngxs-reset-plugin';

import { LanguageModule } from '@/shared/language.module';
import { SharedModule } from '@/shared/shared.module';
import { ApplicationStates } from '@/shared/store';

import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SETTINGS } from '@angular/fire/firestore';

const devModules = [
  NgxsReduxDevtoolsPluginModule.forRoot(),
  NgxsLoggerPluginModule.forRoot(),
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    LanguageModule,
    IonicModule.forRoot({ mode: 'ios' }),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AppRoutingModule,
    SharedModule,
    NgxsModule.forRoot(ApplicationStates, { developmentMode: !environment.production }),
    NgxsRouterPluginModule.forRoot(),
    NgxsResetPluginModule.forRoot(),
    environment.production ? [] : devModules,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy,
    },
    {
      provide: SETTINGS,
      useValue: !environment.emulation ? undefined : {
        host: 'localhost:8081',
        ssl: false
      }
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
