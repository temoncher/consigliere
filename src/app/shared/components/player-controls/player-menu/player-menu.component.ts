import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Select, Store } from '@ngxs/store';
import { PlayersState } from '@shared/store/table/players/players.state';
import { Player } from '@shared/models/player.model';

@Component({
  selector: 'app-player-menu',
  templateUrl: './player-menu.component.html',
  styleUrls: ['./player-menu.component.scss'],
})
export class PlayerMenuComponent implements OnInit {
  @Input() playerId: string;

  player: Player;

  refreshText = 'Сбросить';
  fallText = 'Фол';
  viewProfileText = 'Открыть профиль';
  kickText = 'Удалить игрока';

  constructor(
    private store: Store,
    private popoverController: PopoverController,
    ) { }

  ngOnInit() {
    this.store.select(PlayersState.getPlayer(this.playerId))
      .subscribe((player) => this.player = player);
  }

  chooseOption(role: string) {
    this.popoverController.dismiss(null, role);
  }

  dismissPopover() {
    this.popoverController.dismiss(null, 'cancel');
  }
}
