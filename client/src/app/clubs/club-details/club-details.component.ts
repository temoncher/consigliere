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

  get isMember() {
    return this.club?.admin;
  }

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

  leaveClub() {

  }

  async presentLeaveAlert() {
    const alert = await this.alertController.create({
      header: 'Вы уходите?',
      message: 'Вы точно хотите уйти из клуба?',
      buttons: [
        {
          text: 'Уйти',
          role: 'confirm',
          handler: () => this.leaveClub(),
        },
        {
          text: 'Остаться',
          role: 'cancel',
        },
      ],
    });

    await alert.present();
  }
}
