import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

import {
  DeleteClubGQL,
  ClubAdminPageGQL,
  ClubAdminPageQuery,
  ClubRole,
  CurrentPlayerClubsDocument,
} from '@/graphql/gql.generated';
import { consigliereLogo } from '@/shared/constants/avatars';

@Component({
  selector: 'app-club-admin',
  templateUrl: './club-admin.component.html',
  styleUrls: ['./club-admin.component.scss'],
})
export class ClubAdminComponent implements OnInit, OnDestroy {
  private destroy: Subject<boolean> = new Subject<boolean>();
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
    this.activateRoute.params.pipe(
      takeUntil(this.destroy),
      switchMap(({ clubId }) => this.clubAdminPageGQL.watch({ id: clubId }).valueChanges),
    ).subscribe(({ data, loading }) => {
      this.club = data.club;
      this.loading = loading;
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.unsubscribe();
  }

  deleteClub() {
    this.deleteClubGQL.mutate(
      { clubId: this.club.id },
      {
        refetchQueries: [{ query: CurrentPlayerClubsDocument }],
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
