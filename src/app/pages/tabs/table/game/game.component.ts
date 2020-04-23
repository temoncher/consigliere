import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, IonSlides, PopoverController } from '@ionic/angular';
import { Select, Store } from '@ngxs/store';
import { Observable, of, Subject } from 'rxjs';

import { TableState } from '@shared/store/table/table.state';
import { Day } from '@shared/models/day.model';
import { Player } from '@shared/models/player.model';
import { PlayersState } from '@shared/store/table/players/players.state';
import { CurrentDayState } from '@shared/store/table/current-day/current-day.state';
import { NightModalComponent } from './night-modal/night-modal.component';
import { TimersService } from '@shared/services/timers.service';
import { DayPhase } from '@shared/models/day-phase.enum';
import { VoteModalComponent } from './vote-modal/vote-modal.component';
import { StartVote } from '@shared/store/table/current-day/current-day.actions';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  @ViewChild('playerSlider') playerSlider: IonSlides;

  @Select(TableState.getDays) days$: Observable<Day[]>;

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
    this.timersService.resetTimers();
    this.players = this.store.selectSnapshot(PlayersState.getPlayers);
  }

  ngOnInit() {
    const dayPhase = this.store.selectSnapshot(CurrentDayState.getPhase);

    if (dayPhase === DayPhase.NIGHT) {
      this.presentNightModal();
    }

    if (dayPhase === DayPhase.VOTE) {
      this.presentVoteModal();
    }

    setTimeout(() => {
      // TODO: Remove crutch for slider config update
      this.playerSliderConfig = {
        spaceBetween: 0,
        centeredSlides: true,
        slidesPerView: 1.4,
      };
    }, 0);
  }

  navigateToSlide(index: number) {
    this.controlSliderPlayerNumber = index;
    this.playerSlider.slideTo(index);
  }

  endSpeech(playerId: string) {
    const players = this.store.selectSnapshot<Player[]>(PlayersState.getPlayers);
    const finishedPlayerIndex = players.findIndex((player) => player.user.id === playerId);

    if (finishedPlayerIndex < players.length - 1) {
      const day = this.store.selectSnapshot<Day>(CurrentDayState.getDay);
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

  startVote() {
    this.store.dispatch(new StartVote());
    this.presentVoteModal();
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
