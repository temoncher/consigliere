import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { SettingsMenuComponent } from './settings-menu/settings-menu.component';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.component.html',
  styleUrls: ['profile.component.scss'],
})
export class ProfileComponent {

  constructor(private popoverController: PopoverController) { }

  async presentSettingsMenu() {
    const popover = await this.popoverController.create({
      component: SettingsMenuComponent,
      event,
      translucent: true,
    });

    await popover.present();
  }
}
