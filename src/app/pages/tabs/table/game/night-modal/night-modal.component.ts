import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { NightStages } from '@shared/constants/table';
import { Role } from '@shared/models/role.enum';
import { TableState } from '@shared/store/table/table.state';
import { Player } from '@shared/models/player.model';
import { colors } from '@shared/constants/colors';
import { defaultAvatarSrc } from '@shared/constants/avatars';
import { Day } from '@shared/models/day.model';
import { PlayersState } from '@shared/store/table/players/players.state';
import { GiveRoles } from '@shared/store/table/players/players.actions';
import { Timer } from '@shared/models/timer.model';
import { SwitchDayPhase } from '@shared/store/table/current-day/current-day.actions';
import { DayPhase } from '@shared/models/day-phase.enum';

@Component({
  selector: 'app-night-modal',
  templateUrl: './night-modal.component.html',
  styleUrls: ['./night-modal.component.scss'],
})
export class NightModalComponent implements OnInit {
  @Select(PlayersState.getPlayers) players$: Observable<Player[]>;
  @Select(TableState.getDays) days$: Observable<Day[]>;

  sheriff: Player;
  don: Player;

  colors = colors;
  NightStages = NightStages;
  Role = Role;
  defaultAvatar = defaultAvatarSrc;

  dayNumber = 1;
  time = 20;
  sheriffTimer = new Timer({ time: this.time });
  stage = NightStages.MAFIA;

  toolbarTitle = `Ночь ${this.dayNumber}`;
  mafiaHuntsText = 'Мафия выходит на охоту';
  giveRolesText = 'Игроки выбирают роли';
  donChecksText = 'Просыпается Дон';
  hostMeetsDonText = 'Ведущий знакомится с доном';
  sheriffChecksText = 'Просыпается Шериф';
  hostMeetsSheriffText = 'Просыпается Шериф';
  donNextText = 'Дон';
  sheriffNextText = 'Шериф';
  dayNextText = 'Утро';

  get nextStageButtonText() {
    switch (this.stage) {
      case NightStages.DON:
        return this.sheriffNextText;
      case NightStages.MAFIA:
        return this.donNextText;
      case NightStages.SHERIFF:
        return this.dayNextText;
      default:
        return 'Далее';
    }
  }

  get playerAvatar() {
    return this.sheriff.user.avatar || this.defaultAvatar;
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
  ) {
    this.store.dispatch(new GiveRoles());
    this.sheriff = this.store.selectSnapshot(PlayersState.getSheriff);
    this.don = this.store.selectSnapshot(PlayersState.getDon);
    // this.store.select(TableState.getDayNumber).subscribe((dayNumber) => this.dayNumber = dayNumber);
  }

  ngOnInit() { }

  nextStage() {
    this.sheriffTimer.pauseTimer();

    if (this.stage === NightStages.SHERIFF) {
      this.store.dispatch(new SwitchDayPhase(DayPhase.DAY));
      return this.modalController.dismiss(null, 'cancel');
    }

    this.stage++;
  }

  previousStage() {
    this.sheriffTimer.pauseTimer();
    this.stage--;
  }

  switchTimer() {
    this.sheriffTimer.switchTimer();
  }
}
