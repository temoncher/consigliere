import { Component, OnInit, OnDestroy } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { NightStages } from '@shared/models/table/night-stages.enum';
import { Role } from '@shared/models/role.enum';
import { GameState } from '@shared/store/game/game.state';
import { Player } from '@shared/models/player.model';
import { Round } from '@shared/models/table/round.model';
import { PlayersState } from '@shared/store/game/players/players.state';
import { MenuController } from '@ionic/angular';
import { GameService } from '@shared/services/game.service';

@Component({
  selector: 'app-night',
  templateUrl: './night.component.html',
  styleUrls: ['./night.component.scss'],
})
export class NightComponent implements OnInit, OnDestroy {
  private destroy: Subject<boolean> = new Subject<boolean>();
  @Select(PlayersState.getPlayers) players$: Observable<Player[]>;
  @Select(GameState.getRounds) rounds$: Observable<Round[]>;

  NightStages = NightStages;
  Role = Role;

  roundNumber = 0;
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

  get currentStageText() {
    switch (this.stage) {
      case NightStages.MAFIA:
        return this.roundNumber === 0 ? this.nightTexts.giveRoles : this.nightTexts.mafiaHunts;
      case NightStages.DON:
        return this.roundNumber === 0 ? this.nightTexts.hostMeetsDon : this.nightTexts.donChecks;
      case NightStages.SHERIFF:
        return this.roundNumber === 0 ? this.nightTexts.hostMeetsSheriff : this.nightTexts.sheriffChecks;
      default:
        return 'Oops! Something went wrong';
    }
  }

  constructor(
    private store: Store,
    private translate: TranslateService,
    private menuController: MenuController,
    private gameService: GameService,
  ) {
    this.store.select(GameState.getRoundNumber)
      .pipe(takeUntil(this.destroy))
      .subscribe((roundNumber) => this.roundNumber = roundNumber);

    this.translate.get('TABS.TABLE.GAME.NIGHT')
      .subscribe((nightTexts) => this.nightTexts = nightTexts);
  }

  ngOnInit() { }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.unsubscribe();
  }

  openMenu() {
    this.menuController.open('game-menu');
  }

  nextStage() {
    if (this.stage === NightStages.SHERIFF) {
      this.gameService.endNight();
    }

    this.stage += 1;
  }
}
