import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { switchMap } from 'rxjs/operators';

import {
  DeleteClubGQL,
  ClubAdminPageGQL,
  ClubAdminPageQuery,
  ClubsPageDocument,
  ClubRole,
} from '@/graphql/gql.generated';
import { consigliereLogo } from '@/shared/constants/avatars';

@Component({
  selector: 'app-club-admin',
  templateUrl: './club-admin.component.html',
  styleUrls: ['./club-admin.component.scss'],
})
export class ClubAdminComponent implements OnInit {
  club: ClubAdminPageQuery['club'];
  loading = true;

  defaultAvatar = consigliereLogo;
  ClubRole = ClubRole;

  constructor(
    private store: Store,
    private activateRoute: ActivatedRoute,
    private clubAdminPageGQL: ClubAdminPageGQL,
    private deleteClubGQL: DeleteClubGQL,
    public alertController: AlertController,
  ) {
    // TODO: ubsubscribe
    this.activateRoute.params.pipe(
      switchMap(({ clubId }) => this.clubAdminPageGQL.watch({ id: clubId }).valueChanges),
    ).subscribe(({ data, loading }) => {
      this.club = data.club;
      this.loading = loading;
    });
  }

  ngOnInit() {}

  deleteClub() {
    this.deleteClubGQL.mutate(
      { clubId: this.club.id },
      {
        refetchQueries: [{ query: ClubsPageDocument }],
      },
    ).subscribe(() => {
      this.store.dispatch(new Navigate(['tabs', 'clubs']));
    });
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Закрыть клуб',
      message: 'Вы точно хотите закрыть этот клуб? Это действие необратимо.',
      buttons: [
        {
          text: 'Удалить',
          role: 'confirm',
          handler: () => this.deleteClub(),
        },
        {
          text: 'Отменить',
          role: 'cancel',
        },
      ],
    });

    await alert.present();
  }
}
