import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';

import { GameResult } from '@/graphql/gql.generated';
import { Player } from '@/shared/models/player.model';
import { GameService } from '@/table/services/game.service';
import { PlayersState } from '@/table/store/players/players.state';
import { TableState } from '@/table/store/table.state';

import { Role } from '~types/enums/role.enum';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
})
export class ResultComponent implements OnInit {
  @Select(TableState.getGameResult) gameResult$: Observable<GameResult>;
  @Select(PlayersState.getPlayersByRoles([Role.MAFIA, Role.DON])) mafiaPlayers$: Observable<Player[]>;
  @Select(PlayersState.getPlayersByRoles([Role.CITIZEN, Role.SHERIFF])) citizenPlayers$: Observable<Player[]>;
  @Select(PlayersState.getRoles) roles$: Observable<Record<string, Role>>;

  GameResult = GameResult;

  constructor(private gameService: GameService) { }

  ngOnInit() { }

  proceedToMenu() {
    this.gameService.saveGame();
  }
}
