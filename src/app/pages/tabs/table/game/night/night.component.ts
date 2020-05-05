import { Component, OnInit, OnDestroy } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { NightStages } from '@shared/constants/game';
import { Role } from '@shared/models/role.enum';
import { GameState } from '@shared/store/game/game.state';
import { Player } from '@shared/models/player.model';
import { colors } from '@shared/constants/colors';
import { defaultAvatarSrc } from '@shared/constants/avatars';
import { Round } from '@shared/models/table/round.model';
import { PlayersState } from '@shared/store/game/players/players.state';
import { GiveRoles } from '@shared/store/game/players/players.actions';
import { Timer } from '@shared/models/table/timer.model';
import { EndNight } from '@shared/store/game/round/current-night/current-night.actions';

@Component({
  selector: 'app-night',
  templateUrl: './night.component.html',
  styleUrls: ['./night.component.scss'],
})
export class NightComponent implements OnInit, OnDestroy {
  private destory: Subject<boolean> = new Subject<boolean>();
  @Select(PlayersState.getPlayers) players$: Observable<Player[]>;
  @Select(GameState.getRounds) rounds$: Observable<Round[]>;

  sheriff: Player;
  don: Player;

  colors = colors;
  NightStages = NightStages;
  Role = Role;
  defaultAvatar = defaultAvatarSrc;

  roundNumber = 0;
  time = 20;
  sheriffTimer = new Timer({ time: this.time });
  stage = NightStages.MAFIA;

  nightTexts: {
    mafiaHunts: string;
    giveRoles: string;
    donChecks: string;
    hostMeetsDon: string;
    sheriffChecks: string;
    hostMeetsSheriff: string;
    proceedToDon: string;
    proceedToSheriff: string;
    proceedToMorning: string;
  };

  get nextStageButtonText() {
    switch (this.stage) {
      case NightStages.DON:
        return this.nightTexts.proceedToSheriff;
      case NightStages.MAFIA:
        return this.nightTexts.proceedToDon;
      case NightStages.SHERIFF:
        return this.nightTexts.proceedToMorning;
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
        return this.roundNumber === 0 ? this.nightTexts.giveRoles : this.nightTexts.mafiaHunts;
      case NightStages.DON:
        return this.roundNumber === 0 ? this.nightTexts.hostMeetsDon : this.nightTexts.donChecks;
      case NightStages.SHERIFF:
        return this.roundNumber === 0 ? this.nightTexts.hostMeetsSheriff : this.nightTexts.sheriffChecks;
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

    this.store.select(GameState.getRoundNumber)
      .pipe(takeUntil(this.destory))
      .subscribe((roundNumber) => this.roundNumber = roundNumber);

    this.translate.get('TABS.TABLE.GAME.NIGHT')
      .subscribe((nightTexts) => this.nightTexts = nightTexts);
  }

  ngOnInit() { }

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

  switchTimer() {
    this.sheriffTimer.switchTimer();
  }
}
