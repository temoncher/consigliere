import { Component, OnInit, Input } from '@angular/core';
import { Player } from '@shared/models/player.model';
import { defaultAvatarSrc } from '@shared/constants/avatars';
import { PlayerMenuComponent } from '../player-menu/player-menu.component';
import { PopoverController } from '@ionic/angular';
import { Select } from '@ngxs/store';
import { TableState } from '@shared/store/table/table.state';
import { Observable, timer, Subscription } from 'rxjs';
import { Day } from '@shared/models/table/day.model';

@Component({
  selector: 'app-player-card',
  templateUrl: './player-card.component.html',
  styleUrls: ['./player-card.component.scss'],
})
export class PlayerCardComponent implements OnInit {
  @Input() player: Player;
  @Input() playerNumber = 0;
  @Input() time = 60;
  @Input() proposedPlayer: Player;

  @Select(TableState.getCurrentDay) day$: Observable<Day>;

  timeLeft: number;
  alredyProposedPlayerText = 'Выставил игрока';
  didntProposeAnyPlayerText = 'Не выставил игрока';
  deadPlayerText = 'Игрок выбыл';
  interval: Subscription = Subscription.EMPTY;
  isTimerPaused = true;
  isSpeechEnded = false;

  defaultAvatar = defaultAvatarSrc;
  colors = {
    medium: '#989aa2',
    primary: '#3880ff',
    danger: '#f04141',
  };

  get proposedPlayerText() {
    return this.proposedPlayer ? `${this.alredyProposedPlayerText} ${this.proposedPlayer.nickname}` : this.didntProposeAnyPlayerText;
  }

  get roundedTime() {
    return Math.round(this.timeLeft / 1000);
  }

  get timeColor() {
    if (this.timeLeft === 0 || this.isSpeechEnded) {
      return 'medium';
    }
    if (this.timeLeft < 10000) {
      return 'danger';
    }
    return 'primary';
  }

  constructor(private popoverController: PopoverController) { }

  ngOnInit() {
    this.timeLeft = this.time * 1000;
  }

  switchTimer() {
    if (this.isSpeechEnded) {
      return;
    }

    if (!this.isTimerPaused) {
      return this.pauseTimer();
    }

    this.isTimerPaused = false;
    return this.interval = timer(100, 100).subscribe(() => {
      if (this.timeLeft === 0) {
        return this.endPlayerSpeech();
      }

      this.timeLeft -= 100;
    });
  }

  proposePlayer() {
    this.proposedPlayer = new Player({ nickname: 'Jared' });
  }

  withdrawPlayer() {
    this.proposedPlayer = null;
  }

  endPlayerSpeech() {
    this.pauseTimer();
    this.isSpeechEnded = true;
  }

  private async awaitMenuOptionResult(popover: HTMLIonPopoverElement) {
    const { role } = await popover.onWillDismiss();

    switch (role) {
      case 'refresh':
        this.refresh();
        break;

      case 'fall':
        this.assignFall();
        break;

      default:
        break;
    }
  }

  async presentPopover(event: any) {
    const popover = await this.popoverController.create({
      component: PlayerMenuComponent,
      event,
      translucent: true
    });

    await popover.present();
    await this.awaitMenuOptionResult(popover);
  }

  private refresh() {
    this.pauseTimer();
    this.timeLeft = this.time * 1000;
    this.proposedPlayer = null;
    this.isSpeechEnded = false;
  }

  private assignFall() {
  }

  private pauseTimer() {
    this.isTimerPaused = true;
    return this.interval.unsubscribe();
  }
}
