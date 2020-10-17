import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Select, Store } from '@ngxs/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { PlayerSuggestionsGQL, PlayerSuggestionsQuery } from '@/graphql/gql.generated';
import { defaultAvatarSrc } from '@/shared/constants/avatars';
import { Player, IPlayer } from '@/shared/models/player.model';
import { PlayersState } from '@/table/store/players/players.state';
import { TableState } from '@/table/store/table.state';

@Component({
  selector: 'app-preparation-modal',
  templateUrl: './preparation-modal.component.html',
  styles: [`
    .add-new {
      flex: 1;
    }
  `],
})
export class PreparationModalComponent implements OnInit {
  @Select(PlayersState.getPlayers) players$: Observable<IPlayer[]>;
  @Input() users: PlayerSuggestionsQuery['usersByClub'];

  defaultAvatar = defaultAvatarSrc;

  constructor(
    private store: Store,
    private modalController: ModalController,
    private usersByClubGQL: PlayerSuggestionsGQL,
  ) {
    const clubId = this.store.selectSnapshot(TableState.getClub);
    const suggestedPlayers$ = this.usersByClubGQL.watch({ clubId })
      .valueChanges.pipe(
        map(({ data }) => data.usersByClub),
      );

    combineLatest([suggestedPlayers$, this.players$]).subscribe(([suggestedPlayers, tablePlayers]) => {
      const tablePlayersIds = tablePlayers.map((player) => player.uid);

      this.users = suggestedPlayers.filter(({ uid }) => !tablePlayersIds.includes(uid));
    });
  }

  ngOnInit() { }

  choosePlayer(player?: Player) {
    const role = player ? 'authenticated' : 'guest';

    this.modalController.dismiss(player, role);
  }

  close() {
    this.modalController.dismiss(undefined, 'cancel');
  }
}
