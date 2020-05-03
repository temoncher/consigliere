import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';

import { NightStages } from '@shared/constants/game';
import { Role } from '@shared/models/role.enum';
import { GameState } from '@shared/store/game/game.state';
import { Player } from '@shared/models/player.model';
import { colors } from '@shared/constants/colors';
import { defaultAvatarSrc } from '@shared/constants/avatars';
import { Day } from '@shared/models/table/day.model';
import { PlayersState } from '@shared/store/game/players/players.state';
import { GiveRoles } from '@shared/store/game/players/players.actions';
import { Timer } from '@shared/models/table/timer.model';
import { EndNight } from '@shared/store/game/current-day/current-day.actions';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-night',
  templateUrl: './night.component.html',
  styleUrls: ['./night.component.scss'],
})
export class NightComponent implements OnInit, OnDestroy {
  private destory: Subject<boolean> = new Subject<boolean>();
  @Select(PlayersState.getPlayers) players$: Observable<Player[]>;
  @Select(GameState.getDays) days$: Observable<Day[]>;

  sheriff: Player;
  don: Player;

  colors = colors;
  NightStages = NightStages;
  Role = Role;
  defaultAvatar = defaultAvatarSrc;

  dayNumber = 0;
  time = 20;
  sheriffTimer = new Timer({ time: this.time });
  stage = NightStages.MAFIA;
  toolbarTranslateParam = { dayNumber: this.dayNumber };

  nightTexts: {
    mafiaHuntsText: string;
    giveRolesText: string;
    donChecksText: string;
    hostMeetsDonText: string;
    sheriffChecksText: string;
    hostMeetsSheriffText: string;
    donNextText: string;
    sheriffNextText: string;
    dayNextText: string;
  };

  get toolbarTitle() {
    return `Ночь ${this.dayNumber}`;
  }

  get nextStageButtonText() {
    switch (this.stage) {
      case NightStages.DON:
        return this.nightTexts.sheriffNextText;
      case NightStages.MAFIA:
        return this.nightTexts.donNextText;
      case NightStages.SHERIFF:
        return this.nightTexts.dayNextText;
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
        return this.dayNumber === 0 ? this.nightTexts.giveRolesText : this.nightTexts.mafiaHuntsText;
      case NightStages.DON:
        return this.dayNumber === 0 ? this.nightTexts.hostMeetsDonText : this.nightTexts.donChecksText;
      case NightStages.SHERIFF:
        return this.dayNumber === 0 ? this.nightTexts.hostMeetsSheriffText : this.nightTexts.sheriffChecksText;
      default:
        break;
    }
  }

  constructor(
    private store: Store,
    private translate: TranslateService,
  ) {
    this.store.dispatch(new GiveRoles());

    this.sheriff = this.store.selectSnapshot(PlayersState.getSheriff);
    this.don = this.store.selectSnapshot(PlayersState.getDon);

    this.store.select(GameState.getDayNumber)
      .pipe(takeUntil(this.destory))
      .subscribe((dayNumber) => {
        this.dayNumber = dayNumber;
        this.toolbarTranslateParam.dayNumber = dayNumber;
      });

    this.translate.get('TABS.TABLE.GAME.NIGHT')
      .subscribe((nightTexts) => this.nightTexts = nightTexts);
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.sheriffTimer.pauseTimer();
    this.destory.next();
    this.destory.unsubscribe();
  }

  nextStage() {
    this.sheriffTimer.pauseTimer();

    if (this.stage === NightStages.SHERIFF) {

      this.store.dispatch(new EndNight());
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
