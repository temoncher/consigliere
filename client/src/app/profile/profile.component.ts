import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { PopoverController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { GetUserGQL, GetUserQuery } from '@/graphql/gql.generated';
import { defaultAvatarSrc } from '@/shared/constants/avatars';
import { AuthService } from '@/shared/services/auth.service';
import { GameResult } from '@/table/models/game-result.enum';

import { SettingsMenuComponent } from './settings-menu.component';

type WinnerMap = {
  [key in GameResult]: string;
};

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.component.html',
  styleUrls: ['profile.component.scss'],
})
export class ProfileComponent {
  user$: Observable<GetUserQuery['user']>;

  defaultAvatar = defaultAvatarSrc;
  winnerText: WinnerMap = {
    [GameResult.CIVILIANS]: 'Мирные',
    [GameResult.MAFIA]: 'Мафия',
    [GameResult.TIE]: 'Ничья',
  };

  constructor(
    private popoverController: PopoverController,
    private authService: AuthService,
    private fireauth: AngularFireAuth,
    private userGQL: GetUserGQL,
  ) {
    this.user$ = this.fireauth.user.pipe(
      switchMap((fireUser) => this.userGQL.watch({ id: fireUser.uid }).valueChanges),
      map((userQuery) => userQuery.data.user),
    );
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
