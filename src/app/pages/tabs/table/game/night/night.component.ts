import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Select, Store } from '@ngxs/store';
import { Player } from '@shared/models/player.model';
import { Role } from '@shared/models/role.enum';
import { NightStages } from '@shared/models/table/night-stages.enum';
import { GameService } from '@shared/services/game.service';
import { GameState } from '@shared/store/game/game.state';
import { PlayersState } from '@shared/store/game/players/players.state';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-night',
  templateUrl: './night.component.html',
})
export class NightComponent implements OnInit {
  @Select(PlayersState.getPlayers) players$: Observable<Player[]>;
  @Select(GameState.getRoundNumber) roundNumber$: Observable<number>;

  NightStages = NightStages;
  Role = Role;

  stage = NightStages.MAFIA;

  constructor(private gameService: GameService) {}

  ngOnInit() { }

  nextStage() {
    if (this.stage === NightStages.SHERIFF) {
      this.gameService.endNight();
    }

    this.stage += 1;
  }

  endNight() {
    this.gameService.endNight();
  }
}
