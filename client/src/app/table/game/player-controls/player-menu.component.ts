
import {
  Component,
  OnInit,
  Input,
  OnDestroy,
} from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Player } from '@/shared/models/player.model';
import { PlayerControlsAction } from '@/table/models/player-controls-action.enum';
import { PlayersState } from '@/table/store/players/players.state';

@Component({
  selector: 'app-player-menu',
  template: `
    <ion-list>
      <ion-item
        button
        lines="none"
        class="refresh-option"
        (click)="chooseOption(PlayerControlsAction.REFRESH)"
      >
        {{ refreshText }}
      </ion-item>
      <ion-item
        button
        lines="none"
        class="assign-fall-option"
        [disabled]="playerQuitPhase"
        (click)="chooseOption(PlayerControlsAction.FALL)"
      >
        {{ fallText }}
      </ion-item>
      <ion-item
        button
        lines="none"
        class="kick-option"
        [disabled]="playerQuitPhase"
        (click)="chooseOption(PlayerControlsAction.KICK)"
      >
        {{ kickText }}
      </ion-item>
    </ion-list>
  `,
})
export class PlayerMenuComponent implements OnInit, OnDestroy {
  private destroy: Subject<boolean> = new Subject<boolean>();
  @Input() playerId: string;

  PlayerControlsAction = PlayerControlsAction;

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

  chooseOption(option: PlayerControlsAction) {
    this.popoverController.dismiss(null, option);
  }

  dismissPopover() {
    this.popoverController.dismiss(null, 'cancel');
  }
}
