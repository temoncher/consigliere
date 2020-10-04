import { Component, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { PopoverController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';

import { ProfilePageGQL, ProfilePageQuery } from '@/graphql/gql.generated';
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
export class ProfileComponent implements OnDestroy {
  private destroy: Subject<boolean> = new Subject<boolean>();

  user: ProfilePageQuery['user'];
  games: ProfilePageQuery['lastGames'];

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
      takeUntil(this.destroy),
      switchMap((fireUser) => this.profilePageGQL.watch({ id: fireUser.uid }).valueChanges),
      map((profilePageQuery) => profilePageQuery.data),
    ).subscribe((queryData) => {
      this.user = queryData.user;
      this.games = queryData.lastGames;
    });
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.unsubscribe();
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
