import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Select, Store } from '@ngxs/store';
import { Player } from '@shared/models/player.model';
import { defaultAvatarSrc } from '@shared/constants/avatars';
import { PlayerMenuComponent } from '../player-menu/player-menu.component';
import { TableState } from '@shared/store/table/table.state';
import { Observable, timer, Subscription } from 'rxjs';
import { Day } from '@shared/models/day.model';
import { fadeSlide } from '@shared/animations';
import { EndPlayerSpeech, ResetPlayer } from '@shared/store/table/table.day.actions';
import { colors } from '@shared/constants/colors';

@Component({
  selector: 'app-player-card',
  templateUrl: './player-card.component.html',
  styleUrls: ['./player-card.component.scss'],
  animations: [fadeSlide]
})
export class PlayerCardComponent implements OnInit {
  @Input() player: Player;
  @Input() isBeforeVoteSpeech = false;
  @Input() time = 60;
  @Input() proposedPlayer: Player;

  @Output() speechEnd = new EventEmitter();

  @Select(TableState.getCurrentDay) day$: Observable<Day>;

  timeLeft: number;
  alredyProposedPlayerText = 'Выставил игрока';
  didntProposeAnyPlayerText = 'Не выставил игрока';
  deadPlayerText = 'Игрок выбыл';
  interval: Subscription = Subscription.EMPTY;
  isTimerPaused = true;
  isSpeechEnded = false;
  colors = colors;

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

  get playerAvatar() {
    return this.player.user.avatar || defaultAvatarSrc;
  }

  constructor(
    private store: Store,
    private popoverController: PopoverController
  ) { }

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
    this.proposedPlayer = new Player(
      {
        number: 1,
        nickname: 'Jared',
        user: { id: 'jared' },
      });
  }

  withdrawPlayer() {
    if (this.isSpeechEnded) {
      return;
    }
    this.proposedPlayer = null;
  }

  endPlayerSpeech() {
    this.pauseTimer();
    this.isSpeechEnded = true;
    this.store.dispatch(new EndPlayerSpeech(this.player.user.id, this.timeLeft, this.proposedPlayer?.user?.id));
    this.speechEnd.emit(this.player.user.id);
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
    this.store.dispatch(new ResetPlayer(this.player.user.id));
  }

  private assignFall() {
  }

  private pauseTimer() {
    this.isTimerPaused = true;
    return this.interval.unsubscribe();
  }
}
