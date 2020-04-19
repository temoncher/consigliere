import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, IonSlides, PopoverController } from '@ionic/angular';
import { Select, Store } from '@ngxs/store';
import { Observable, of } from 'rxjs';

import { TableState } from '@shared/store/table/table.state';
import { Day } from '@shared/models/day.model';
import { Player } from '@shared/models/player.model';
import { PlayersState } from '@shared/store/table/players/players.state';
import { CurrentDayState } from '@shared/store/table/current-day/current-day.state';
import { AssignFall } from '@shared/store/table/players/players.actions';
import { ResetPlayer, KickPlayer } from '@shared/store/table/current-day/current-day.actions';
import { NightModalComponent } from './night-modal/night-modal.component';
import { PlayerMenuComponent } from './player-menu/player-menu.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  @ViewChild('numberSlider') numberSlider: IonSlides;
  @ViewChild('playerSlider') playerSlider: IonSlides;

  @Select(TableState.getDays) days$: Observable<Day[]>;
  @Select(PlayersState.getPlayers) players$: Observable<Player[]>;
  players = [];

  numberSliderConfig = {
    slidesPerView: 5.5,
    centeredSlides: true,
  };
  playerSliderConfig = {
    spaceBetween: 0,
    centeredSlides: true,
    slidesPerView: 1.4,
  };
  dayText = 'День';

  constructor(
    private store: Store,
    private modalController: ModalController,
    private popoverController: PopoverController,
  ) {
  }

  ngOnInit() {
    this.presentNightModal();
  }

  openPlayerMenu(player: Player) {
    this.presentPlayerMenu(player);
  }

  navigateToSlide(index: number) {
    this.numberSlider.slideTo(index);
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
  proposePlayer() { }
  withdrawPlayer() { }

  async presentNightModal() {
    const nightModal = await this.modalController.create({
      component: NightModalComponent,
      swipeToClose: true,
    });

    await nightModal.present();
  }

  async presentPlayerMenu(player: Player) {
    const popover = await this.popoverController.create({
      component: PlayerMenuComponent,
      event,
      translucent: true,
    });

    await popover.present();
    await this.awaitMenuOptionResult(popover, player);
  }

  private async awaitMenuOptionResult(popover: HTMLIonPopoverElement, player: Player) {
    const { role } = await popover.onWillDismiss();

    switch (role) {
      case 'refresh':
        this.refresh(player);
        break;

      case 'fall':
        this.store.dispatch(new AssignFall(player.user.id));
        break;

      case 'kick':
        this.store.dispatch(new KickPlayer(player.user.id));
        break;

      default:
        break;
    }
  }

  private refresh(player: Player) {
    // this.timeLeft = this.time * 1000;
    // this.isSpeechEnded = false;
    // this.pauseTimer();
    this.store.dispatch(new ResetPlayer(player.user.id));
  }
}
