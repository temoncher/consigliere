import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';

import { Player } from '@/shared/models/player.model';
import { Role } from '@/shared/models/role.enum';
import { NightStages } from '@/table/models/night-stages.enum';
import { GameService } from '@/table/services/game.service';
import { PlayersState } from '@/table/store/players/players.state';
import { TableState } from '@/table/store/table.state';

@Component({
  selector: 'app-night',
  templateUrl: './night.component.html',
})
export class NightComponent implements OnInit {
  @Select(PlayersState.getPlayers) players$: Observable<Player[]>;
  @Select(TableState.getRoundNumber) roundNumber$: Observable<number>;

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
