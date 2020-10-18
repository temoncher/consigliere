import {
  Component, OnInit, ViewChild, OnDestroy,
} from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { Select, Store } from '@ngxs/store';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { playerSliderConfig } from '@/shared/constants/slider';
import { Player } from '@/shared/models/player.model';
import { GameService } from '@/table/services/game.service';
import { TimersService } from '@/table/services/timers.service';
import { GameMenuState } from '@/table/store/menu/game-menu.state';
import { PlayersState } from '@/table/store/players/players.state';
import { RoundState } from '@/table/store/round/round.state';

import { RoundPhase } from '~types/enums/round-phase.enum';
import { IQuitPhase } from '~types/interfaces/quit-phase.interface';

@Component({
  selector: 'app-day',
  templateUrl: './day.component.html',
  styles: [`
    .day {
      padding-top: 32px
    }
  `],
})
export class DayComponent implements OnDestroy {
  private destroy: Subject<boolean> = new Subject<boolean>();
  @ViewChild('playerSlider') playerSlider: IonSlides;

  @Select(GameMenuState.getBasicProp('isQuittedHidden')) isQuittedHidden$: Observable<boolean>;
  @Select(RoundState.getRoundPhase) currentPhase$: Observable<RoundPhase>;
  @Select(PlayersState.getQuitPhases) quitPhases$: Observable<Record<string, IQuitPhase>>;
  @Select(PlayersState.getPlayers) players$: Observable<Player[]>;

  quitPhases: Record<string, IQuitPhase>;

  playerSliderConfig = playerSliderConfig;

  constructor(
    private store: Store,
    private timersService: TimersService,
    private gameService: GameService,
  ) {
    this.quitPhases$
      .pipe(takeUntil(this.destroy))
      .subscribe((quitPhases) => this.quitPhases = quitPhases);
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.unsubscribe();
  }

  navigateToSlide(index: number): void {
    this.playerSlider.slideTo(index);
  }

  endSpeech(playerId: string): void {
    const players = this.store.selectSnapshot(PlayersState.getPlayers);
    const quitPhases = this.store.selectSnapshot(PlayersState.getQuitPhases);
    const finishedPlayerIndex = players.findIndex((player) => player.uid === playerId);

    if (finishedPlayerIndex < players.length - 1) {
      const slideIndex = players.findIndex(({ uid }) => !quitPhases[uid]
        && !this.timersService.getPlayerTimer(uid)?.isSpeechEnded);

      this.navigateToSlide(slideIndex);
    }
  }

  endDay(): void {
    this.gameService.endDay();
  }
}
