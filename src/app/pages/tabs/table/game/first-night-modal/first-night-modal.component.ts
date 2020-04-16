import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ModalController, IonSlides } from '@ionic/angular';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription, timer } from 'rxjs';

import { NightStages } from '@shared/constants/table';
import { TableState } from '@shared/store/table/table.state';
import { Player } from '@shared/models/player.model';
import { GiveRoles } from '@shared/store/table/table.player.actions';
import { colors } from '@shared/constants/colors';
import { defaultAvatarSrc } from '@shared/constants/avatars';

@Component({
  selector: 'app-first-night-modal',
  templateUrl: './first-night-modal.component.html',
  styleUrls: ['./first-night-modal.component.scss'],
})
export class FirstNightModalComponent implements OnInit, AfterViewInit {
  @ViewChild('roleSlider') roleSlider: IonSlides;

  @Select(TableState.getPlayers) players$: Observable<Player[]>;
  sheriff: Player;
  don: Player;

  colors = colors;
  roleSliderConfig = {
    spaceBetween: 0,
    centeredSlides: true,
    slidesPerView: 1,
    onlyExternal: false,
  };
  toolbarTitle = 'Ночь 0';
  timeLeft = 10000;
  isTimerPaused = true;
  stage = NightStages.MAFIA;
  interval: Subscription = Subscription.EMPTY;

  get playerAvatar() {
    return (this.stage === NightStages.SHERIFF ? this.sheriff.user.avatar : this.don.user.avatar) || defaultAvatarSrc;
  }

  get roundedTime() {
    return Math.round(this.timeLeft / 1000);
  }

  constructor(
    private store: Store,
    private modalController: ModalController,
  ) { }

  ngOnInit() {
    this.store.dispatch(new GiveRoles());
    this.sheriff = this.store.selectSnapshot<Player>(TableState.getSheriff);
    this.don = this.store.selectSnapshot<Player>(TableState.getDon);
  }

  ngAfterViewInit() {
    this.roleSlider.lockSwipes(true);
  }

  nextSlide() {
    this.roleSlider.lockSwipes(false);
    this.roleSlider.slideNext();
    this.roleSlider.lockSwipes(true);
  }

  nextStage() {
    if (this.stage === 2) {
      return this.modalController.dismiss(undefined, 'cancel');
    }

    this.pauseTimer();
    this.timeLeft = 10000;
    this.stage++;
  }

  switchTimer() {
    if (this.timeLeft === 0) {
      return;
    }

    if (!this.isTimerPaused) {
      return this.pauseTimer();
    }

    this.isTimerPaused = false;
    return this.interval = timer(100, 100).subscribe(() => {
      if (this.timeLeft === 0) {
        return;
      }

      this.timeLeft -= 100;
    });
  }

  private pauseTimer() {
    this.isTimerPaused = true;
    return this.interval.unsubscribe();
  }
}
