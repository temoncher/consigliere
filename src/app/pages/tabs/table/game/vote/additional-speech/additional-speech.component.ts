import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Subject, Observable, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SwiperOptions } from 'swiper';

import { Player } from '@shared/models/player.model';
import { Timer } from '@shared/models/table/timer.model';
import { colors } from '@shared/constants/colors';
import { defaultAvatarSrc } from '@shared/constants/avatars';
import { PlayersState } from '@shared/store/game/players/players.state';
import { CurrentVoteState } from '@shared/store/game/round/current-vote/current-vote.state';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-additional-speech',
  templateUrl: './additional-speech.component.html',
  styleUrls: ['./additional-speech.component.scss'],
})
export class AdditionalSpeechComponent implements OnInit, OnDestroy {
  private destroy: Subject<boolean> = new Subject<boolean>();
  @ViewChild('playerSlider') playerSlider: IonSlides;

  @Select(PlayersState.getPlayers) players$: Observable<Player[]>;
  @Select(CurrentVoteState.getLeaders) leaders$: Observable<string[]>;

  defaultAvatar = defaultAvatarSrc;
  colors = colors;

  leaders: Player[];

  playerSliderConfig: SwiperOptions = {
    spaceBetween: 0,
    centeredSlides: true,
    slidesPerView: 1.4,
  };
  timers = new Map<string, Timer>();
  maxTime = 30;

  constructor() {
    combineLatest([this.players$, this.leaders$])
      .pipe(takeUntil(this.destroy))
      .subscribe(([players, ledaerIds]) => {
        this.leaders = players?.filter(({ user: { id } }) => ledaerIds?.includes(id));

        if (ledaerIds) {
          for (const leaderId of ledaerIds) {
            this.timers.set(leaderId, new Timer({ time: this.maxTime }));
          }
        }
      });
  }

  ngOnInit() { }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.unsubscribe();
  }

  endPlayerSpeech(playerId: string) {
    const finishedPlayerIndex = this.leaders.findIndex((player) => player.user.id === playerId);
    this.timers.get(playerId).endSpeech();

    if (finishedPlayerIndex < this.leaders?.length - 1) {
      const slideIndex = this.leaders.findIndex(({ user: { id } }) => !this.timers.get(id).isSpeechEnded);

      this.playerSlider.slideTo(slideIndex);
    }
  }

  getTimeColor(playerId: string) {
    const timer = this.timers.get(playerId);

    if (timer?.time === 0 || timer?.isSpeechEnded) {
      return 'medium';
    }
    if (timer?.time < 10) {
      return 'danger';
    }
    return 'primary';
  }
}
