import {
  Component, OnInit, OnDestroy, ViewChild,
} from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { Select } from '@ngxs/store';
import { Subject, Observable, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { defaultAvatarSrc } from '@/shared/constants/avatars';
import { colors } from '@/shared/constants/colors';
import { playerSliderConfig } from '@/shared/constants/slider';
import { Player } from '@/shared/models/player.model';
import { Timer } from '@/table/models/timer.model';
import { PlayersState } from '@/table/store/players/players.state';
import { CurrentVoteState } from '@/table/store/round/current-vote/current-vote.state';

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

  playerSliderConfig = playerSliderConfig;
  timers = new Map<string, Timer>();
  maxTime = 30;

  constructor() {
    combineLatest([this.players$, this.leaders$])
      .pipe(takeUntil(this.destroy))
      .subscribe(([players, ledaerIds]) => {
        this.leaders = players?.filter(({ user: { uid: id } }) => ledaerIds?.includes(id));

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
    const finishedPlayerIndex = this.leaders.findIndex((player) => player.user.uid === playerId);

    this.timers.get(playerId).endSpeech();

    if (finishedPlayerIndex < this.leaders?.length - 1) {
      const slideIndex = this.leaders.findIndex(({ user: { uid: id } }) => !this.timers.get(id).isSpeechEnded);

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
