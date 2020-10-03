import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { GameService } from '@/table/services/game.service';
import { ToggleGameMenuBoolean } from '@/table/store/menu/game-menu.actions';
import { GameMenuStateModel } from '@/table/store/menu/game-menu.model';
import { GameMenuState } from '@/table/store/menu/game-menu.state';

@Component({
  selector: 'app-game-menu',
  templateUrl: './game-menu.component.html',
  styleUrls: ['./game-menu.component.scss'],
})
export class GameMenuComponent implements OnInit {
  @Select(GameMenuState.getBasicProp('isRolesVisible')) isRolesVisible$: Observable<boolean>;
  @Select(GameMenuState.getBasicProp('isQuittedHidden')) isQuittedHidden$: Observable<boolean>;

  constructor(
    private store: Store,
    private gameService: GameService,
  ) { }

  ngOnInit() { }

  switchSettingsBoolean(settingName: keyof GameMenuStateModel) {
    this.store.dispatch(new ToggleGameMenuBoolean(settingName));
  }

  dropGame() {
    this.gameService.dropGame();
  }
}
