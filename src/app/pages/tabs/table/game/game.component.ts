import { Component, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { GameMenuState } from '@shared/store/game/menu/menu.state';
import { Observable } from 'rxjs';
import { ToggleGameMenuBoolean } from '@shared/store/game/menu/menu.actions';
import { GameService } from '@shared/services/game.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  @Select(GameMenuState.getBasicProp('isRolesVisible')) isRolesVisible$: Observable<boolean>;
  @Select(GameMenuState.getBasicProp('isQuittedHidden')) isQuittedHidden$: Observable<boolean>;

  constructor(
    private store: Store,
    private gameService: GameService,
  ) { }

  ngOnInit() { }

  switchSettingsBoolean(settingName: string) {
    this.store.dispatch(new ToggleGameMenuBoolean(settingName));
  }

  dropGame() {
    this.gameService.dropGame();
  }
}
