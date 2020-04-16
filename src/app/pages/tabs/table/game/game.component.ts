import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, IonSlides } from '@ionic/angular';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { TableState } from '@shared/store/table/table.state';
import { Day } from '@shared/models/day.model';
import { StartNewDay } from '@shared/store/table/table.day.actions';
import { Player } from '@shared/models/player.model';
import { NightModalComponent } from './night-modal/night-modal.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  @ViewChild('numberSlider') numberSlider: IonSlides;
  @ViewChild('playerSlider') playerSlider: IonSlides;

  @Select(TableState.getDays) days$: Observable<Day[]>;
  @Select(TableState.getPlayers) players$: Observable<Player[]>;

  numberSliderConfig = {
    slidesPerView: 5.5,
    centeredSlides: true
  };
  playerSliderConfig = {
    spaceBetween: 0,
    centeredSlides: true,
    slidesPerView: 1.4
  };
  dayText = 'День';

  constructor(
    private store: Store,
    private modalController: ModalController,
  ) { }

  ngOnInit() {
    this.store.dispatch(new StartNewDay());

    this.presentNightModal();
  }

  navigateToSlide(index: number) {
    this.playerSlider.slideTo(index);
    this.numberSlider.slideTo(index);
  }

  endSpeech(playerId: string) {
    const players = this.store.selectSnapshot<Player[]>(TableState.getPlayers);
    const finishedPlayerIndex = players.findIndex((player) => player.user.id === playerId);

    if (finishedPlayerIndex < players.length - 1) {
      const day = this.store.selectSnapshot<Day>(TableState.getCurrentDay);
      const slideIndex = players.findIndex(
        (player, index) => index > finishedPlayerIndex && !player.quitPhase && !day.timers[player.user.id]
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
}
