import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Select, Store } from '@ngxs/store';
import { Observable, combineLatest, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { PlayerSuggestionsGQL, PlayerSuggestionsQuery } from '@/graphql/gql.generated';
import { defaultAvatarSrc } from '@/shared/constants/avatars';
import { Player, IPlayer } from '@/shared/models/player.model';
import { PlayersState } from '@/table/store/players/players.state';
import { TableState } from '@/table/store/table.state';

@Component({
  selector: 'app-player-suggestions-modal',
  templateUrl: './player-suggestions-modal.component.html',
  styles: [`
    .add-new {
      flex: 1;
    }
  `],
})
export class PlayerSuggestionsModalComponent implements OnInit, OnDestroy {
  private destroy: Subject<boolean> = new Subject<boolean>();
  @Select(PlayersState.getPlayers) players$: Observable<IPlayer[]>;
  users: PlayerSuggestionsQuery['usersByClub'] = [];
  loading = false;

  defaultAvatar = defaultAvatarSrc;

  constructor(
    private store: Store,
    private modalController: ModalController,
    private usersByClubGQL: PlayerSuggestionsGQL,
  ) {
    const { club } = this.store.selectSnapshot(TableState.getTableMeta);

    if (club) {
      this.loading = true;
      const suggestedPlayers$ = this.usersByClubGQL.watch({ clubId: club })
        .valueChanges.pipe(
          map(({ data }) => data.usersByClub),
        );

      combineLatest([suggestedPlayers$, this.players$]).pipe(
        takeUntil(this.destroy),
      ).subscribe(([suggestedPlayers, tablePlayers]) => {
        this.loading = false;
        const tablePlayersIds = tablePlayers.map((player) => player.uid);

        this.users = suggestedPlayers.filter(({ uid }) => !tablePlayersIds.includes(uid));
      });
    }
  }

  ngOnInit() { }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.unsubscribe();
  }

  choosePlayer(player?: Player) {
    const role = player ? 'authenticated' : 'guest';

    this.modalController.dismiss(player, role);
  }

  close() {
    this.modalController.dismiss(undefined, 'cancel');
  }
}
