import { Component, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { GameMenuState } from '@shared/store/game/menu/menu.state';
import { Observable } from 'rxjs';
import { ToggleGameMenuBoolean } from '@shared/store/game/menu/menu.actions';
import { DropGame } from '@shared/store/game/game.actions';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  @Select(GameMenuState.getBasicProp('isRolesVisible')) isRolesVisible$: Observable<boolean>;
  @Select(GameMenuState.getBasicProp('isQuittedHidden')) isQuittedHidden$: Observable<boolean>;

  constructor(private store: Store) { }

  ngOnInit() { }

  switchSettingsBoolean(settingName: string) {
    this.store.dispatch(new ToggleGameMenuBoolean(settingName));
  }

  dropGame() {
    this.store.dispatch(new DropGame());
  }
}
