import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Player } from '@shared/models/player.model';
import { Role } from '@shared/models/role.enum';
import { GameResult } from '@shared/models/table/game-result.enum';
import { GameService } from '@shared/services/game.service';
import { GameState } from '@shared/store/game/game.state';
import { PlayersState } from '@shared/store/game/players/players.state';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
})
export class ResultComponent implements OnInit {
  @Select(GameState.getGameResult) gameResult$: Observable<GameResult>;
  @Select(PlayersState.getPlayersByRoles([Role.MAFIA, Role.DON])) mafiaPlayers$: Observable<Player[]>;
  @Select(PlayersState.getPlayersByRoles([Role.CITIZEN, Role.SHERIFF])) citizenPlayers$: Observable<Player[]>;

  GameResult = GameResult;

  constructor(private gameService: GameService) { }

  ngOnInit() { }

  proceedToMenu() {
    this.gameService.saveGame();
  }
}
