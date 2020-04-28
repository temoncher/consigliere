import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Select, Store } from '@ngxs/store';
import { PlayersState } from '@shared/store/game/players/players.state';
import { Player } from '@shared/models/player.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-player-menu',
  templateUrl: './player-menu.component.html',
  styleUrls: ['./player-menu.component.scss'],
})
export class PlayerMenuComponent implements OnInit, OnDestroy {
  private destory: Subject<boolean> = new Subject<boolean>();
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
      .pipe(takeUntil(this.destory))
      .subscribe((player) => this.player = player);
  }

  ngOnDestroy() {
    this.destory.next();
    this.destory.unsubscribe();
  }

  chooseOption(role: string) {
    this.popoverController.dismiss(null, role);
  }

  dismissPopover() {
    this.popoverController.dismiss(null, 'cancel');
  }
}
