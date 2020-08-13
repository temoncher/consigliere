import {
  Component, OnInit, ViewChild, OnDestroy,
} from '@angular/core';
import { IonSlides, MenuController } from '@ionic/angular';
import { Select, Store } from '@ngxs/store';
import { Subject, Observable } from 'rxjs';
import { SwiperOptions } from 'swiper';

import { RoundPhase } from '@shared/models/table/day-phase.enum';
import { GameState } from '@shared/store/game/game.state';
import { Round } from '@shared/models/table/round.model';
import { TimersService } from '@shared/services/timers.service';
import { PlayersState } from '@shared/store/game/players/players.state';
import { Player } from '@shared/models/player.model';
import { GameMenuState } from '@shared/store/game/menu/menu.state';
import { RoundState } from '@shared/store/game/round/round.state';
import { QuitPhase } from '@shared/models/quit-phase.interface';
import { GameService } from '@shared/services/game.service';

@Component({
  selector: 'app-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.scss'],
})
export class DayComponent implements OnInit, OnDestroy {
  private destroy: Subject<boolean> = new Subject<boolean>();
  @ViewChild('playerSlider') playerSlider: IonSlides;

  @Select(GameMenuState.getBasicProp('isQuittedHidden')) isQuittedHidden$: Observable<boolean>;
  @Select(RoundState.getRoundPhase) currentPhase$: Observable<RoundPhase>;
  @Select(PlayersState.getQuitPhases) quitPhases$: Observable<Map<string, QuitPhase>>;
  @Select(PlayersState.getPlayers) players$: Observable<Player[]>;
  @Select(GameState.getRounds) rounds$: Observable<Round[]>;

  playerSliderConfig: SwiperOptions = {
    spaceBetween: 0,
    centeredSlides: true,
    slidesPerView: 1.4,
  };
  controlSliderPlayerNumber = 0;

  constructor(
    private store: Store,
    private timersService: TimersService,
    private menuController: MenuController,
    private gameService: GameService,
  ) { }

  ngOnInit() { }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.unsubscribe();
  }

  openMenu() {
    this.menuController.open('game-menu');
  }

  navigateToSlide(index: number) {
    this.controlSliderPlayerNumber = index;
    this.playerSlider.slideTo(index);
  }

  endSpeech(playerId: string) {
    const players = this.store.selectSnapshot(PlayersState.getPlayers);
    const quitPhases = this.store.selectSnapshot(PlayersState.getQuitPhases);
    const finishedPlayerIndex = players.findIndex((player) => player.user.id === playerId);

    if (finishedPlayerIndex < players.length - 1) {
      const slideIndex = players.findIndex(({ user: { id } }) => !quitPhases.has(id)
        && !this.timersService.getPlayerTimer(id).isSpeechEnded);

      this.navigateToSlide(slideIndex);
    }
  }

  endDay() {
    this.gameService.endDay();
  }
}
