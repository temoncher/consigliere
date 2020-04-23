import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { PlayerMenuComponent } from '../player-menu/player-menu.component';
import { AssignFall, ResetPlayer } from '@shared/store/table/players/players.actions';
import { KickPlayer } from '@shared/store/table/current-day/current-day.actions';
import { Store } from '@ngxs/store';
import { TimersService } from '@shared/services/timers.service';

@Component({
  selector: 'app-manage-player-card',
  templateUrl: './manage-player-card.component.html',
  styleUrls: ['./manage-player-card.component.scss'],
})
export class ManagePlayerCardComponent implements OnInit {
  @Input() playerId: string;
  @Input() showRole = false;
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
      case 'refresh':
        this.refresh();
        break;

      case 'fall':
        this.store.dispatch(new AssignFall(this.playerId));
        break;

      case 'kick':
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
