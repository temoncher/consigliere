import {
  Component, OnInit, Input, Output, EventEmitter, OnDestroy,
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Select, Store } from '@ngxs/store';
import { fadeSlide } from '@shared/animations';
import { defaultAvatarSrc } from '@shared/constants/avatars';
import { colors } from '@shared/constants/colors';
import { Player } from '@shared/models/player.model';
import { Timer } from '@shared/models/table/timer.model';
import { TimersService } from '@shared/services/timers.service';
import { PlayersState } from '@shared/store/game/players/players.state';
import {
  ProposePlayer,
  WithdrawPlayer,
} from '@shared/store/game/round/current-day/current-day.actions';
import { CurrentDayState } from '@shared/store/game/round/current-day/current-day.state';
import { CurrentVoteState } from '@shared/store/game/round/current-vote/current-vote.state';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ProposeModalComponent } from '../propose-modal/propose-modal.component';

@Component({
  selector: 'app-player-timer',
  templateUrl: './player-timer.component.html',
  styleUrls: ['./player-timer.component.scss'],
  animations: [fadeSlide],
})
export class PlayerTimerComponent implements OnInit, OnDestroy {
  private destroy: Subject<boolean> = new Subject<boolean>();
  @Input() playerId: string;

  @Output() speechEnd = new EventEmitter();

  @Select(CurrentVoteState.getIsVoteDisabled) isVoteDisabled$: Observable<boolean>;
  proposedPlayer$: Observable<Player>;

  player: Player;
  timer: Timer;
  playerQuitPhase: string;

  defaultAvatar = defaultAvatarSrc;
  colors = colors;

  maxTime = 60;

  get timeColor() {
    if (this.timer?.time === 0 || this.timer?.isSpeechEnded || this.playerQuitPhase) {
      return 'medium';
    }

    if (this.timer?.time < 10) {
      return 'danger';
    }

    return 'primary';
  }

  constructor(
    private store: Store,
    private modalController: ModalController,
    private timersService: TimersService,
  ) { }

  ngOnInit() {
    this.timer = this.timersService.getPlayerTimer(this.playerId);

    this.store.select(PlayersState.getPlayer(this.playerId))
      .pipe(takeUntil(this.destroy))
      .subscribe((player) => this.player = player);

    this.store.select(PlayersState.getPlayerQuitPhase(this.playerId))
      .pipe(takeUntil(this.destroy))
      .subscribe((playerQuitPhase) => this.playerQuitPhase = playerQuitPhase);

    this.proposedPlayer$ = this.store.select(CurrentDayState.getProposedPlayer(this.playerId));
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.unsubscribe();
  }

  switchTimer() {
    const wasTimerPaused = this.timer.isPaused;

    this.timersService.pauseAll();

    if (wasTimerPaused) {
      this.timer.switchTimer();
    }
  }

  withdrawPlayer() {
    this.store.dispatch(new WithdrawPlayer(this.playerId));
  }

  endPlayerSpeech() {
    this.timer.endSpeech();
    this.timersService.pauseAll();
    this.speechEnd.emit(this.playerId);
  }

  async proposePlayer() {
    const proposeModal = await this.modalController.create({
      component: ProposeModalComponent,
      swipeToClose: true,
    });

    await proposeModal.present();
    this.awaitProposeModalResult(proposeModal);
  }

  private async awaitProposeModalResult(proposeModal: HTMLIonModalElement) {
    const { data: proposedPlayer, role } = await proposeModal.onWillDismiss();

    switch (role) {
      case 'propose':
        this.store.dispatch(new ProposePlayer(this.playerId, proposedPlayer.user.id));
        break;

      default:
        break;
    }
  }
}
