import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { switchMap } from 'rxjs/operators';

import {
  ClubDetailsPageGQL,
  ClubDetailsPageQuery,
  ClubRole,
  ClubsPageDocument,
  DeleteClubGQL,
} from '@/graphql/gql.generated';
import { consigliereLogo } from '@/shared/constants/avatars';

@Component({
  selector: 'app-club-details',
  templateUrl: './club-details.component.html',
  styleUrls: ['./club-details.component.scss'],
})
export class ClubDetailsComponent implements OnInit {
  club: ClubDetailsPageQuery['club'];
  loading = true;

  defaultAvatar = consigliereLogo;
  ClubRole = ClubRole;

  constructor(
    private store: Store,
    private activateRoute: ActivatedRoute,
    private clubDetailsPageGQL: ClubDetailsPageGQL,
    private deleteClubGQL: DeleteClubGQL,
    public alertController: AlertController,
  ) {
    // TODO: ubsubscribe
    this.activateRoute.params.pipe(
      switchMap(({ clubId }) => this.clubDetailsPageGQL.watch({ id: clubId }).valueChanges),
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
      this.store.dispatch(new Navigate(
        ['../'],
        null,
        { relativeTo: this.activateRoute },
      ));
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
