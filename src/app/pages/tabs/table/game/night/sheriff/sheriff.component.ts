import { Component, OnInit, OnDestroy } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { PlayersState } from '@shared/store/game/players/players.state';
import { Player } from '@shared/models/player.model';
import { Timer } from '@shared/models/table/timer.model';
import { colors } from '@shared/constants/colors';
import { defaultAvatarSrc } from '@shared/constants/avatars';
import { CurrentNightState } from '@shared/store/game/round/current-night/current-night.state';
import { GameState } from '@shared/store/game/game.state';
import { Round } from '@shared/models/table/round.model';
import { CheckBySheriff } from '@shared/store/game/round/current-night/current-night.actions';

@Component({
  selector: 'app-sheriff',
  templateUrl: './sheriff.component.html',
  styleUrls: ['./sheriff.component.scss'],
})
export class SheriffComponent implements OnInit, OnDestroy {
  @Select(PlayersState.getSheriff) sheriff$: Observable<Player>;
  @Select(CurrentNightState.getSheriffCheck) sheriffCheck$: Observable<string>;
  @Select(PlayersState.getPlayers) players$: Observable<Player[]>;
  @Select(GameState.getRounds) rounds$: Observable<Round[]>;

  colors = colors;
  defaultAvatar = defaultAvatarSrc;

  currentPlayerIndex = 0;
  time = 20;
  sheriffTimer = new Timer({ time: this.time });

  constructor(private store: Store) { }

  ngOnInit() { }

  ngOnDestroy() {
    this.sheriffTimer.pauseTimer();
  }

  check() {
    const players = this.store.selectSnapshot(PlayersState.getPlayers);

    if (players) {
      this.store.dispatch(new CheckBySheriff(players[this.currentPlayerIndex].user.id));
    }
  }

  navigateToPlayer(playerNumber: number) {
    this.currentPlayerIndex = playerNumber - 1;
  }

  switchTimer() {
    this.sheriffTimer.switchTimer();
  }
}
