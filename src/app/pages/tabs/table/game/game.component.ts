import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Select } from '@ngxs/store';
import { RoundPhase } from '@shared/models/table/day-phase.enum';
import { GameResult } from '@shared/models/table/game-result.enum';
import { Round } from '@shared/models/table/round.model';
import { GameState } from '@shared/store/game/game.state';
import { RoundState } from '@shared/store/game/round/round.state';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  @Select(GameState.getGameResult) gameResult$: Observable<GameResult>;
  @Select(RoundState.getRoundPhase) currentPhase$: Observable<RoundPhase>;
  @Select(GameState.getRoundNumber) roundNumber$: Observable<number>;

  RoundPhase = RoundPhase;

  constructor(private menuController: MenuController) { }

  ngOnInit() { }

  openMenu() {
    this.menuController.open('game-menu');
  }
}
