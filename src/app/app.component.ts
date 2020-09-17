import { Component } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Platform } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { LanguageService } from '@shared/services/language.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private store: Store,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private languageService: LanguageService,
  ) {
    if (window.Cypress) {
      window.store = this.store;
    }

    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.languageService.setInitialAppLanguage();
    });
  }
}
