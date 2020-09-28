import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { defaultAvatarSrc } from '@/shared/constants/avatars';
import { User } from '@/shared/models/user.interface';
import { AuthService } from '@/shared/services/auth.service';
import { FetchUser } from '@/shared/store/user/user.actions';
import { UserState } from '@/shared/store/user/user.state';

import { SettingsMenuComponent } from './settings-menu.component';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.component.html',
  styleUrls: ['profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  @Select(UserState.getState) user$: Observable<User>;

  defaultAvatar = defaultAvatarSrc;

  constructor(
    private store: Store,
    private popoverController: PopoverController,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.store.dispatch(new FetchUser());
  }

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
