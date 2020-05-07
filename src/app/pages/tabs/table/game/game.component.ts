import { Component, OnInit } from '@angular/core';
import { Store, Select, Actions, ofActionSuccessful } from '@ngxs/store';
import { GameMenuState } from '@shared/store/game/menu/menu.state';
import { Observable } from 'rxjs';
import { ToggleGameMenuBoolean } from '@shared/store/game/menu/menu.actions';
import { DropGame, StartNewRound } from '@shared/store/game/game.actions';
import { SetIsVoteDisabled } from '@shared/store/game/round/current-vote/current-vote.actions';

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
    private actions$: Actions,
  ) {
    this.actions$.pipe(ofActionSuccessful(StartNewRound))
      .subscribe(() => this.store.dispatch(new SetIsVoteDisabled()));
  }

  ngOnInit() { }

  switchSettingsBoolean(settingName: string) {
    this.store.dispatch(new ToggleGameMenuBoolean(settingName));
  }

  dropGame() {
    this.store.dispatch(new DropGame());
  }
}
