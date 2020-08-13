import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';

import { GameResult } from '@shared/models/table/game-result.enum';
import { GameState } from '@shared/store/game/game.state';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
})
export class ResultComponent implements OnInit {
  @Select(GameState.getGameResult) gameResult$: Observable<GameResult>;

  GameResult = GameResult;

  constructor() { }

  ngOnInit() { }
}
