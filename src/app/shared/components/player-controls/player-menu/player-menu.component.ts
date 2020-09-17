import {
  Component, OnInit, Input, OnDestroy,
} from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { Player } from '@shared/models/player.model';
import { PlayersState } from '@shared/store/game/players/players.state';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-player-menu',
  templateUrl: './player-menu.component.html',
  styleUrls: ['./player-menu.component.scss'],
})
export class PlayerMenuComponent implements OnInit, OnDestroy {
  private destroy: Subject<boolean> = new Subject<boolean>();
  @Input() playerId: string;

  player: Player;
  playerQuitPhase: string;

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
      .pipe(takeUntil(this.destroy))
      .subscribe((player) => this.player = player);

    this.store.select(PlayersState.getPlayerQuitPhase(this.playerId))
      .pipe(takeUntil(this.destroy))
      .subscribe((playerQuitPhase) => this.playerQuitPhase = playerQuitPhase);
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.unsubscribe();
  }

  chooseOption(role: string) {
    this.popoverController.dismiss(null, role);
  }

  dismissPopover() {
    this.popoverController.dismiss(null, 'cancel');
  }
}
