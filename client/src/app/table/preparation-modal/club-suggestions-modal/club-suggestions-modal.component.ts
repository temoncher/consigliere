import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { CurrentPlayerClubsGQL, CurrentPlayerClubsQuery } from '@/graphql/gql.generated';
import { consigliereLogo } from '@/shared/constants/avatars';

@Component({
  selector: 'app-club-suggestions-modal',
  templateUrl: './club-suggestions-modal.component.html',
  styleUrls: ['./club-suggestions-modal.component.scss'],
})
export class ClubSuggestionsModalComponent implements OnInit {
  loading = true;
  clubs: CurrentPlayerClubsQuery['currentPlayerClubs'] = [];

  consigliereLogo = consigliereLogo;

  constructor(
    private modalController: ModalController,
    private clubsPageGQL: CurrentPlayerClubsGQL,
  ) {
    this.clubsPageGQL.watch().valueChanges
      .subscribe(({ data, loading }) => {
        this.loading = loading;
        this.clubs = data.currentPlayerClubs;
      });
  }

  ngOnInit() {}

  chooseClub(club?: CurrentPlayerClubsQuery['currentPlayerClubs'][0]) {
    const data = {
      club,
    };

    this.modalController.dismiss(data, 'choose');
  }

  close() {
    this.modalController.dismiss(undefined, 'cancel');
  }
}
