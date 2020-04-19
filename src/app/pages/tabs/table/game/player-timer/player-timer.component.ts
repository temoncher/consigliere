import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PopoverController, ModalController } from '@ionic/angular';
import { Select, Store } from '@ngxs/store';
import { Observable, timer, Subscription } from 'rxjs';

import { Player } from '@shared/models/player.model';
import { defaultAvatarSrc } from '@shared/constants/avatars';
import { Day } from '@shared/models/day.model';
import { fadeSlide } from '@shared/animations';
import { colors } from '@shared/constants/colors';
import { CurrentDayState } from '@shared/store/table/current-day/current-day.state';
import { PlayersState } from '@shared/store/table/players/players.state';
import {
  ProposePlayer,
  WithdrawPlayer,
  StopSpeech,
} from '@shared/store/table/current-day/current-day.actions';
import { ProposeModalComponent } from '../propose-modal/propose-modal.component';
import { DayPhase } from '@shared/models/day-phase.enum';

@Component({
  selector: 'app-player-timer',
  templateUrl: './player-timer.component.html',
  styleUrls: ['./player-timer.component.scss'],
  animations: [fadeSlide],
})
export class PlayerTimerComponent implements OnInit {
  @Input() player: Player;
  @Input() time = 60;

  @Output() speechEnd = new EventEmitter();

  @Select(CurrentDayState.getDay) day$: Observable<Day>;
  @Select(PlayersState.getPlayers) players$: Observable<Player[]>;
  proposedPlayer$: Observable<Player>;

  players: Player[];
  timeLeft: number;

  colors = colors;

  interval: Subscription = Subscription.EMPTY;
  isTimerPaused = true;
  isSpeechEnded = false;

  get roundedTime() {
    return Math.round(this.timeLeft / 1000);
  }

  get timeColor() {
    if (this.timeLeft === 0 || this.isSpeechEnded || this.player.quitPhase) {
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

  get quitPhase() {
    if (this.player.quitPhase) {
      return `${this.player.quitPhase.number}${(this.player.quitPhase.stage === DayPhase.NIGHT ? 'н' : 'д')}`;
    }

    return '';
  }

  constructor(
    private store: Store,
    private modalController: ModalController,
  ) { }

  ngOnInit() {
    this.timeLeft = this.time * 1000;
    this.players = this.store.selectSnapshot(PlayersState.getPlayers);

    this.proposedPlayer$ = this.store.select(CurrentDayState.getProposedPlayer(this.player.user.id));
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

  async proposePlayer() {
    const proposeModal = await this.modalController.create({
      component: ProposeModalComponent,
      swipeToClose: true,
    });

    await proposeModal.present();
    await this.awaitProposeModalResult(proposeModal);
  }

  private async awaitProposeModalResult(proposeModal: HTMLIonModalElement) {
    const { data: proposedPlayer, role } = await proposeModal.onWillDismiss();

    switch (role) {
      case 'propose':
        this.store.dispatch(new ProposePlayer(this.player.user.id, proposedPlayer.user.id));
        break;

      default:
        break;
    }
  }

  withdrawPlayer() {
    this.store.dispatch(new WithdrawPlayer(this.player.user.id));
  }

  endPlayerSpeech() {
    this.pauseTimer();
    this.isSpeechEnded = true;
    this.speechEnd.emit(this.player.user.id);
  }

  private pauseTimer() {
    this.isTimerPaused = true;
    this.store.dispatch(new StopSpeech(this.player.user.id, this.timeLeft));
    return this.interval.unsubscribe();
  }
}
