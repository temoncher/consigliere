import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Store } from '@ngxs/store';

import { AuthService } from '@/shared/services/auth.service';
import { UserState } from '@/shared/store/user/user.state';

import { SettingsMenuComponent } from './settings-menu.component';

@Component({
  selector: 'app-profile',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ "TABS.PROFILE.header" | translate:userParam }}</ion-title>

        <ion-buttons slot="end">
          <ion-button (click)="logout()">
            <ion-icon slot="icon-only" name="exit-outline"></ion-icon>
          </ion-button>
          <!-- TODO: add translation languages -->
          <!-- <ion-button (click)="presentSettingsMenu()">
            <ion-icon slot="icon-only" name="globe-outline"></ion-icon>
          </ion-button> -->
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="no-scroll">
      <ion-title>{{ "TABS.PROFILE.header" | translate:userParam }}</ion-title>
    </ion-content>
  `,
})
export class ProfileComponent {
  get userParam() {
    const user = this.store.selectSnapshot(UserState.getState);

    return {
      name: user.nickname,
    };
  }

  constructor(
    private store: Store,
    private popoverController: PopoverController,
    private authService: AuthService,
  ) { }

  async logout() {
    await this.authService.logout();
  }

  async presentSettingsMenu() {
    const popover = await this.popoverController.create({
      component: SettingsMenuComponent,
      translucent: true,
    });

    await popover.present();
  }
}
