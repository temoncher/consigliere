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
    this.preventDoubleTapZoom();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.languageService.setInitialAppLanguage();
    });
  }

  preventDoubleTapZoom() {
    /**
     * workaround for ios double tap zoom
     * https://medium.com/building-blocks/code-snippet-4accfa29b75d
     *
     * */
    let doubleTouchStartTimestamp = 0;

    document.addEventListener('touchstart', (event) => {
      const now = +(new Date());

      if (doubleTouchStartTimestamp + 500 > now) {
        event.preventDefault();
      }

      doubleTouchStartTimestamp = now;
    });
  }
}
