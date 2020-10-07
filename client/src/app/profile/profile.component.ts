import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { PopoverController } from '@ionic/angular';
import { filter, map, switchMap } from 'rxjs/operators';

import { ProfilePageGQL, ProfilePageQuery } from '@/graphql/gql.generated';
import { consigliereLogo, defaultAvatarSrc } from '@/shared/constants/avatars';
import { AuthService } from '@/shared/services/auth.service';

import { SettingsMenuComponent } from './settings-menu.component';

import { GameResult } from '~types/enums/game-result.enum';

type WinnerMap = {
  [key in GameResult]: string;
};

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.component.html',
  styleUrls: ['profile.component.scss'],
})
export class ProfileComponent {
  user: ProfilePageQuery['user'];
  games: ProfilePageQuery['playersLastGames'];
  loading = true;

  defaultGameAvatar = consigliereLogo;
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
    private profilePageGQL: ProfilePageGQL,
  ) {
    this.fireauth.user.pipe(
      filter((fireUser) => !!fireUser),
      switchMap((fireUser) => this.profilePageGQL.watch({ id: fireUser.uid }).valueChanges),
    ).subscribe(({ data, loading }) => {
      this.loading = loading;
      this.user = data.user;
      this.games = data.playersLastGames;
    });
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
