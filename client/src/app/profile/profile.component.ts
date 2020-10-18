import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { PopoverController } from '@ionic/angular';
import { switchMap } from 'rxjs/operators';

import { ProfilePageGQL, ProfilePageQuery, GameResult } from '@/graphql/gql.generated';
import { consigliereLogo, defaultAvatarSrc } from '@/shared/constants/avatars';
import { isNotNullOrUndefined } from '@/shared/pipes/is-not-null-or-undefined.pipe';
import { AuthService } from '@/shared/services/auth.service';

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
  user?: ProfilePageQuery['user'];
  games?: ProfilePageQuery['lastGamesByUserId'];
  loading = true;

  defaultGameAvatar = consigliereLogo;
  defaultAvatar = defaultAvatarSrc;
  winnerText: WinnerMap = {
    [GameResult.Civilians]: 'Мирные',
    [GameResult.Mafia]: 'Мафия',
    [GameResult.Tie]: 'Ничья',
  };

  constructor(
    private popoverController: PopoverController,
    private authService: AuthService,
    private fireauth: AngularFireAuth,
    private profilePageGQL: ProfilePageGQL,
  ) {
    // TODO: ubsubscribe
    this.fireauth.user.pipe(
      isNotNullOrUndefined(),
      switchMap((fireUser) => this.profilePageGQL.watch({ id: fireUser.uid }).valueChanges),
    ).subscribe(({ data, loading }) => {
      this.loading = loading;
      this.user = data.user;
      this.games = data.lastGamesByUserId.map((game) => ({
        ...game,
        date: new Date(game.date).toLocaleDateString(),
      }));
    });
  }

  async logout(): Promise<void> {
    await this.authService.logout();
  }

  async presentSettingsMenu(): Promise<void> {
    const popover = await this.popoverController.create({
      component: SettingsMenuComponent,
      translucent: true,
    });

    await popover.present();
  }
}
