import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { GameService } from '@shared/services/game.service';
import { ToggleGameMenuBoolean } from '@shared/store/game/menu/game-menu.actions';
import { GameMenuStateModel } from '@shared/store/game/menu/game-menu.model';
import { GameMenuState } from '@shared/store/game/menu/game-menu.state';
import { Observable } from 'rxjs';

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
