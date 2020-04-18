import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { TableState } from '@shared/store/table/table.state';
import { Player } from '@shared/models/player.model';
import { defaultAvatarSrc } from '@shared/constants/avatars';
import { ModalController } from '@ionic/angular';
import { Day } from '@shared/models/day.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-propose-modal',
  templateUrl: './propose-modal.component.html',
  styleUrls: ['./propose-modal.component.scss'],
})
export class ProposeModalComponent implements OnInit {
  @Select(TableState.getPlayers) players$: Observable<Player[]>;
  proposedPlayers$: Observable<Map<string, string>>;

  players: Player[];
  proposedPlayers: Map<string, string>;

  defaultAvatar = defaultAvatarSrc;

  currentPlayerIndex = 0;

  toolbarTitle = 'Выставить игрока';
  proposeButtonText = 'Выставить';

  constructor(
    private store: Store,
    private modalController: ModalController,
  ) { }

  ngOnInit() {
    const day$ = this.store.select(TableState.getCurrentDay);
    this.proposedPlayers$ = day$.pipe(map((day) => day.proposedPlayers));
    this.proposedPlayers$.subscribe((proposedPlayers) => this.proposedPlayers = proposedPlayers);
    this.players$.subscribe((players) => this.players = players);

    this.currentPlayerIndex = this.players.findIndex((player) => !this.proposedPlayers.has(player.user.id));
  }

  navigateToPlayer(player: Player) {
    if (!this.proposedPlayers.has(player.user.id)) {
      this.currentPlayerIndex = player.number - 1;
    }
  }

  proposePlayer() {
    this.modalController.dismiss(this.players[this.currentPlayerIndex], 'propose');
  }

  close() {
    this.modalController.dismiss(null, 'cancel');
  }

}
