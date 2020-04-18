import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription, timer } from 'rxjs';

import { NightStages } from '@shared/constants/table';
import { Role } from '@shared/models/role.enum';
import { TableState } from '@shared/store/table/table.state';
import { Player } from '@shared/models/player.model';
import { colors } from '@shared/constants/colors';
import { defaultAvatarSrc } from '@shared/constants/avatars';
import { Day } from '@shared/models/day.model';
import { GiveRoles } from '@shared/store/table/table.preparation.actions';

@Component({
  selector: 'app-night-modal',
  templateUrl: './night-modal.component.html',
  styleUrls: ['./night-modal.component.scss'],
})
export class NightModalComponent implements OnInit {
  @Select(TableState.getPlayers) players$: Observable<Player[]>;
  @Select(TableState.getDays) days$: Observable<Day[]>;

  sheriff: Player;
  don: Player;

  colors = colors;
  NightStages = NightStages;
  Role = Role;
  defaultAvatar = defaultAvatarSrc;

  dayNumber = 0;
  time = 20;
  timeLeft = 20000;
  isTimerPaused = true;
  stage = NightStages.MAFIA;
  interval: Subscription = Subscription.EMPTY;

  toolbarTitle = `Ночь ${this.dayNumber}`;
  mafiaHuntsText = 'Мафия выходит на охоту';
  giveRolesText = 'Игроки выбирают роли';
  donChecksText = 'Просыпается Дон';
  hostMeetsDonText = 'Ведущий знакомится с доном';
  sheriffChecksText = 'Просыпается Шериф';
  hostMeetsSheriffText = 'Просыпается Шериф';

  get playerAvatar() {
    return this.sheriff.user.avatar || this.defaultAvatar;
  }

  get roundedTime() {
    return Math.round(this.timeLeft / 1000);
  }

  get currentStageText() {
    switch (this.stage) {
      case NightStages.MAFIA:
        return this.dayNumber === 0 ? this.giveRolesText : this.mafiaHuntsText;
      case NightStages.DON:
        return this.dayNumber === 0 ? this.hostMeetsDonText : this.donChecksText;
      case NightStages.SHERIFF:
        return this.dayNumber === 0 ? this.hostMeetsSheriffText : this.sheriffChecksText;
      default:
        break;
    }
  }

  constructor(
    private store: Store,
    private modalController: ModalController,
  ) { }

  ngOnInit() {
    this.timeLeft = this.time * 1000;
    this.store.dispatch(new GiveRoles());
    this.sheriff = this.store.selectSnapshot<Player>(TableState.getSheriff);
    this.don = this.store.selectSnapshot<Player>(TableState.getDon);

    this.days$.subscribe((days) => this.dayNumber = days.length - 1);
  }

  nextStage() {
    this.pauseTimer();
    if (this.stage === NightStages.SHERIFF) {
      return this.modalController.dismiss(null, 'cancel');
    }

    this.stage++;
  }

  previousStage() {
    this.pauseTimer();
    this.stage--;
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
