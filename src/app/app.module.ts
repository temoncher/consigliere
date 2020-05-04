import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';
import { AngularFireModule } from '@angular/fire';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicStorageModule } from '@ionic/storage';
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { NgxsResetPluginModule } from 'ngxs-reset-plugin';

import { ApplicationStates } from '@shared/store';
import { SharedModule } from '@shared/shared.module';
import { LanguageModule } from '@shared/language.module';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

const devModules = environment.production ? [] : [
  NgxsReduxDevtoolsPluginModule.forRoot(),
  NgxsLoggerPluginModule.forRoot(),
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    LanguageModule,
    IonicModule.forRoot({
      mode: 'ios',
    }),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AppRoutingModule,
    SharedModule,
    NgxsModule.forRoot(ApplicationStates, { developmentMode: !environment.production }),
    NgxsRouterPluginModule.forRoot(),
    NgxsResetPluginModule.forRoot(),
    devModules,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
