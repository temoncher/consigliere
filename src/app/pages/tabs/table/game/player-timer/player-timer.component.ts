import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Player } from '@shared/models/player.model';
import { defaultAvatarSrc } from '@shared/constants/avatars';
import { Day } from '@shared/models/table/day.model';
import { fadeSlide } from '@shared/animations';
import { colors } from '@shared/constants/colors';
import { CurrentDayState, CurrentDayStateModel } from '@shared/store/game/current-day/current-day.state';
import { PlayersState } from '@shared/store/game/players/players.state';
import {
  ProposePlayer,
  WithdrawPlayer,
} from '@shared/store/game/current-day/current-day.actions';
import { DayPhase } from '@shared/models/table/day-phase.enum';
import { TimersService } from '@shared/services/timers.service';
import { Timer } from '@shared/models/table/timer.model';
import { ProposeModalComponent } from '../propose-modal/propose-modal.component';

@Component({
  selector: 'app-player-timer',
  templateUrl: './player-timer.component.html',
  styleUrls: ['./player-timer.component.scss'],
  animations: [fadeSlide],
})
export class PlayerTimerComponent implements OnInit, OnDestroy {
  private destory: Subject<boolean> = new Subject<boolean>();
  @Input() playerId: string;

  @Output() speechEnd = new EventEmitter();

  @Select(CurrentDayState.getDay) day$: Observable<CurrentDayStateModel>;
  @Select(PlayersState.getPlayers) players$: Observable<Player[]>;
  proposedPlayer$: Observable<Player>;

  player: Player;
  players: Player[] = null;
  timer: Timer;

  colors = colors;

  maxTime = 60;

  get timeColor() {
    if (this.timer?.time === 0 || this.timer?.isSpeechEnded || this.player.quitPhase) {
      return 'medium';
    }
    if (this.timer?.time < 10) {
      return 'danger';
    }
    return 'primary';
  }

  get playerAvatar() {
    return this.player?.user.avatar || defaultAvatarSrc;
  }

  get quitPhase() {
    if (this.player?.quitPhase) {
      return `${this.player?.quitPhase.number}${(this.player?.quitPhase.stage === DayPhase.NIGHT ? 'н' : 'д')}`;
    }

    return '';
  }

  constructor(
    private store: Store,
    private modalController: ModalController,
    private timersService: TimersService,
  ) {
    this.players = this.store.selectSnapshot(PlayersState.getPlayers);
  }

  ngOnInit() {
    this.store.select(PlayersState.getPlayer(this.playerId))
      .pipe(takeUntil(this.destory))
      .subscribe((player) => this.player = player);
    this.timer = this.timersService.getPlayerTimer(this.playerId);
    this.proposedPlayer$ = this.store.select(CurrentDayState.getProposedPlayer(this.playerId));
  }

  ngOnDestroy() {
    this.destory.next();
    this.destory.unsubscribe();
  }

  switchTimer() {
    this.timer.switchTimer();
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

  withdrawPlayer() {
    this.store.dispatch(new WithdrawPlayer(this.playerId));
  }

  endPlayerSpeech() {
    this.timer.endSpeech();
    this.speechEnd.emit(this.playerId);
  }
}
