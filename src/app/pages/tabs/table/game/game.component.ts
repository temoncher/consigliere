import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ModalController, IonSlides } from '@ionic/angular';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';

import { GameState } from '@shared/store/game/game.state';
import { Day } from '@shared/models/table/day.model';
import { Player } from '@shared/models/player.model';
import { PlayersState } from '@shared/store/game/players/players.state';
import { CurrentDayState } from '@shared/store/game/current-day/current-day.state';
import { NightModalComponent } from './night-modal/night-modal.component';
import { TimersService } from '@shared/services/timers.service';
import { DayPhase } from '@shared/models/table/day-phase.enum';
import { VoteModalComponent } from './vote-modal/vote-modal.component';
import { takeUntil } from 'rxjs/operators';
import { EndDay } from '@shared/store/game/current-day/current-day.actions';
import { StartNight } from '@shared/store/game/game.actions';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit, OnDestroy {
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
    private modalController: ModalController,
    private timersService: TimersService,
  ) {
    this.players = this.store.selectSnapshot(PlayersState.getPlayers);
    this.currentPhase$
      .pipe(takeUntil(this.destory))
      .subscribe((newDayPhase) => {
        switch (newDayPhase) {
          case DayPhase.NIGHT:
            this.timersService.resetTimers();
            return this.presentNightModal();
          case DayPhase.VOTE:
            this.timersService.resetTimers();
            return this.presentVoteModal();

          default:
            break;
        }
      });
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

  async presentNightModal() {
    const nightModal = await this.modalController.create({
      component: NightModalComponent,
      swipeToClose: true,
    });

    await nightModal.present();
  }

  async presentVoteModal() {
    const voteModal = await this.modalController.create({
      component: VoteModalComponent,
      swipeToClose: true,
    });

    await voteModal.present();
    this.awaitVoteModalResult(voteModal);
  }

  private async awaitVoteModalResult(voteModal: HTMLIonModalElement) {
    const result = voteModal.onWillDismiss();
  }
}
