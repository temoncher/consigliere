import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PopoverController, ModalController } from '@ionic/angular';
import { Select, Store } from '@ngxs/store';
import { Player } from '@shared/models/player.model';
import { defaultAvatarSrc } from '@shared/constants/avatars';
import { PlayerMenuComponent } from '../player-menu/player-menu.component';
import { TableState } from '@shared/store/table/table.state';
import { Observable, timer, Subscription } from 'rxjs';
import { Day } from '@shared/models/day.model';
import { fadeSlide } from '@shared/animations';
import { StopSpeech, ResetPlayer, ProposePlayer, WithdrawPlayer } from '@shared/store/table/table.day.actions';
import { colors } from '@shared/constants/colors';
import { ProposeModalComponent } from '../propose-modal/propose-modal.component';
import { pluck, mergeMap, map } from 'rxjs/operators';

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

  @Select(TableState.getCurrentDay) day$: Observable<Day>;
  @Select(TableState.getPlayers) players$: Observable<Player[]>;
  proposedPlayer$: Observable<Player>;

  players: Player[];
  timeLeft: number;

  colors = colors;

  interval: Subscription = Subscription.EMPTY;
  isTimerPaused = true;
  isSpeechEnded = false;
  deadPlayerText = 'Игрок выбыл';

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
    private popoverController: PopoverController,
    private modalController: ModalController,
  ) { }

  ngOnInit() {
    this.timeLeft = this.time * 1000;
    this.players = this.store.selectSnapshot<Player[]>(TableState.getPlayers);

    this.proposedPlayer$ = this.store.select(TableState.getProposedPlayer(this.player.user.id));
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

  async presentPlayerMenu(event: any) {
    const popover = await this.popoverController.create({
      component: PlayerMenuComponent,
      event,
      translucent: true,
    });

    await popover.present();
    await this.awaitMenuOptionResult(popover);
  }

  private refresh() {
    this.timeLeft = this.time * 1000;
    this.isSpeechEnded = false;
    this.pauseTimer();
    this.store.dispatch(new ResetPlayer(this.player.user.id));
  }

  private assignFall() {
  }

  private pauseTimer() {
    this.isTimerPaused = true;
    this.store.dispatch(new StopSpeech(this.player.user.id, this.timeLeft));
    return this.interval.unsubscribe();
  }
}
