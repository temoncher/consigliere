import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { PlayerControlsAction } from '@shared/models/table/player-controls-action.enum';
import { TimersService } from '@shared/services/timers.service';
import { AssignFall, ResetPlayer } from '@shared/store/game/players/players.actions';
import { KickPlayer } from '@shared/store/game/round/round.actions';

import { PlayerMenuComponent } from '../player-menu/player-menu.component';

@Component({
  selector: 'app-manage-player-card',
  templateUrl: './manage-player-card.component.html',
  styleUrls: ['./manage-player-card.component.scss'],
})
export class ManagePlayerCardComponent implements OnInit {
  @Input() playerId: string;
  @Input() showRole = false;
  @Input() showFalls = false;
  @Input() showProposedPlayer = false;

  constructor(
    private store: Store,
    private popoverController: PopoverController,
    private timersService: TimersService,
  ) { }

  ngOnInit() { }

  async presentPlayerMenu(event: MouseEvent) {
    const popover = await this.popoverController.create({
      component: PlayerMenuComponent,
      componentProps: {
        playerId: this.playerId,
      },
      event,
      translucent: true,
    });

    await popover.present();
    this.awaitMenuOptionResult(popover);
  }

  private async awaitMenuOptionResult(popover: HTMLIonPopoverElement) {
    const { role } = await popover.onWillDismiss();

    switch (role) {
      case PlayerControlsAction.REFRESH:
        this.refresh();
        break;

      case PlayerControlsAction.FALL:
        this.store.dispatch(new AssignFall(this.playerId));
        break;

      case PlayerControlsAction.KICK:
        this.store.dispatch(new KickPlayer(this.playerId));
        break;

      default:
        break;
    }
  }

  private refresh() {
    this.timersService.resetPlayerTimer(this.playerId);
    this.store.dispatch(new ResetPlayer(this.playerId));
  }
}
