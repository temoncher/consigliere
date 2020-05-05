import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { takeUntil } from 'rxjs/operators';

import { CurrentDayState, CurrentDayStateModel } from '@shared/store/game/round/current-day/current-day.state';
import { Player } from '@shared/models/player.model';
import { Timer } from '@shared/models/table/timer.model';
import { colors } from '@shared/constants/colors';
import { defaultAvatarSrc } from '@shared/constants/avatars';
import { TimersService } from '@shared/services/timers.service';
import { PlayersState } from '@shared/store/game/players/players.state';

@Component({
  selector: 'app-additional-speech',
  templateUrl: './additional-speech.component.html',
  styleUrls: ['./additional-speech.component.scss'],
})
export class AdditionalSpeechComponent implements OnInit, OnDestroy {
  private destory: Subject<boolean> = new Subject<boolean>();
  @Input() playerId: string;

  @Output() speechEnd = new EventEmitter();

  @Select(CurrentDayState.getDay) day$: Observable<CurrentDayStateModel>;

  player: Player;
  timer: Timer;
  playerQuitPhase: string;

  defaultAvatar = defaultAvatarSrc;
  colors = colors;

  maxTime = 30;

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
    private timersService: TimersService,
  ) { }

  ngOnInit() {
    this.store.select(PlayersState.getPlayer(this.playerId))
      .pipe(takeUntil(this.destory))
      .subscribe((player) => this.player = player);

    this.store.select(PlayersState.getPlayerQuitPhase(this.playerId))
      .pipe(takeUntil(this.destory))
      .subscribe((playerQuitPhase) => this.playerQuitPhase = playerQuitPhase);

    this.timer = this.timersService.getPlayerTimer(this.playerId);
  }

  ngOnDestroy() {
    this.destory.next();
    this.destory.unsubscribe();
  }

  endPlayerSpeech() {
    this.timer.endSpeech();
    this.speechEnd.emit(this.playerId);
  }
}
