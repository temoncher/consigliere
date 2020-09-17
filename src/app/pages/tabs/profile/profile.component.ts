import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';

import { SettingsMenuComponent } from './settings-menu.component';

@Component({
  selector: 'app-profile',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ "TABS.PROFILE.header" | translate }}</ion-title>

        <!-- TODO: add translation languages -->
        <!-- <ion-buttons slot="end">
          <ion-button (click)="presentSettingsMenu()">
            <ion-icon slot="icon-only" name="globe-outline"></ion-icon>
          </ion-button>
        </ion-buttons> -->
      </ion-toolbar>
    </ion-header>

    <ion-content class="grid-content-center">
      <ion-title>{{ "TABS.PROFILE.header" | translate }}</ion-title>
    </ion-content>
  `,
  styles: [`
    ion-content ion-toolbar {
      --background: translucent;
    }
  `],
})
export class ProfileComponent {
  constructor(private popoverController: PopoverController) { }

  async presentSettingsMenu() {
    const popover = await this.popoverController.create({
      component: SettingsMenuComponent,
      translucent: true,
    });

    await popover.present();
  }
}
