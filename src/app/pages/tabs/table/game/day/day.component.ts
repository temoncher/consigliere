import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { IonSlides, ModalController } from '@ionic/angular';
import { Select, Store } from '@ngxs/store';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CurrentDayState } from '@shared/store/game/current-day/current-day.state';
import { DayPhase } from '@shared/models/table/day-phase.enum';
import { GameState } from '@shared/store/game/game.state';
import { Day } from '@shared/models/table/day.model';
import { TimersService } from '@shared/services/timers.service';
import { PlayersState } from '@shared/store/game/players/players.state';
import { Player } from '@shared/models/player.model';
import { EndDay } from '@shared/store/game/current-day/current-day.actions';

@Component({
  selector: 'app-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.scss'],
})
export class DayComponent implements OnInit, OnDestroy {
  private destory: Subject<boolean> = new Subject<boolean>();
  @ViewChild('playerSlider') playerSlider: IonSlides;

  @Select(CurrentDayState.getPhase) currentPhase$: Observable<DayPhase>;
  @Select(GameState.getDays) days$: Observable<Day[]>;

  dayText = 'День';
  voteText = 'Голосовать';
  showRolesText = 'Показать роли';
  hideRolesText = 'Скрыть роли';

  playerSliderConfig = {};
  controlSliderPlayerNumber = 0;
  isRolesShown = false;
  players = [];

  get rolesButtonText() {
    return this.isRolesShown ? this.hideRolesText : this.showRolesText;
  }

  get voteButtonText() {
    return this.voteText;
  }

  constructor(
    private store: Store,
  ) {
    this.players = this.store.selectSnapshot(PlayersState.getPlayers);
  }

  ngOnInit() {
    setTimeout(() => {
      // TODO: Remove crutch for slider config update
      this.playerSliderConfig = {
        spaceBetween: 0,
        centeredSlides: true,
        slidesPerView: 1.4,
      };
    }, 0);
  }

  ngOnDestroy() {
    this.destory.next();
    this.destory.unsubscribe();
  }

  navigateToSlide(index: number) {
    this.controlSliderPlayerNumber = index;
    this.playerSlider.slideTo(index);
  }

  endSpeech(playerId: string) {
    const players = this.store.selectSnapshot<Player[]>(PlayersState.getPlayers);
    const finishedPlayerIndex = players.findIndex((player) => player.user.id === playerId);

    if (finishedPlayerIndex < players.length - 1) {
      const day = this.store.selectSnapshot(CurrentDayState.getDay);
      const slideIndex = players.findIndex(
        (player, index) => index > finishedPlayerIndex && !player.quitPhase && !day.timers[player.user.id],
      );

      this.navigateToSlide(slideIndex);
      return;
    }
  }

  switchIsRolesShown() {
    this.isRolesShown = !this.isRolesShown;
  }

  endDay() {
    this.store.dispatch(new EndDay());
  }
}
