import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { switchMap } from 'rxjs/operators';

import {
  ClubDetailsPageGQL,
  ClubDetailsPageDocument,
  ClubDetailsPageQuery,
  ClubRole,
  JoinPublicClubGQL,
  LeaveClubGQL,
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
  statusLoading = true;

  leavePrompt = {
    header: 'Вы уходите?',
    defaultMessage: 'Вы точно хотите уйти из клуба?',
    adminMessage: 'Глава должен сложить полномочия перед уходом.',
  };

  defaultAvatar = consigliereLogo;
  ClubRole = ClubRole;

  get isMember() {
    return this.club?.admin;
  }

  constructor(
    private activateRoute: ActivatedRoute,
    private clubDetailsPageGQL: ClubDetailsPageGQL,
    private joinPublicClubGQL: JoinPublicClubGQL,
    private leaveClubGQL: LeaveClubGQL,
    public alertController: AlertController,
  ) {
    // TODO: ubsubscribe
    // TODO: implement club not found page
    this.activateRoute.params.pipe(
      switchMap(({ clubId }) => this.clubDetailsPageGQL.watch({ id: clubId }).valueChanges),
    ).subscribe(({ data, loading }) => {
      this.club = data.club;
      this.loading = loading;
      this.statusLoading = loading;
    });
  }

  ngOnInit() {}

  leaveClub() {
    const clubId = this.club.id;

    this.statusLoading = true;
    this.leaveClubGQL.mutate(
      { clubId },
      {
        refetchQueries: [{
          query: ClubDetailsPageDocument,
          variables: { id: clubId },
        }],
      },
    ).subscribe();
  }

  joinClub() {
    const clubId = this.club.id;

    this.statusLoading = true;
    this.joinPublicClubGQL.mutate(
      { clubId },
      {
        refetchQueries: [{
          query: ClubDetailsPageDocument,
          variables: { id: clubId },
        }],
      },
    ).subscribe();
  }

  async presentLeaveAlert() {
    const message = this.club.role === ClubRole.Admin ? this.leavePrompt.adminMessage : this.leavePrompt.defaultMessage;
    const defaultButtons = [
      {
        text: 'Уйти',
        role: 'confirm',
        handler: () => this.leaveClub(),
      },
      {
        text: 'Остаться',
        role: 'cancel',
      },
    ];
    const adminButtons = [
      {
        text: 'Остаться',
        role: 'cancel',
      },
    ];
    const buttons = this.club.role === ClubRole.Admin ? adminButtons : defaultButtons;

    const alert = await this.alertController.create({
      header: this.leavePrompt.header,
      message,
      buttons,
    });

    await alert.present();
  }
}
