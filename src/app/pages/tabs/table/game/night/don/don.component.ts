import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { PlayersState } from '@shared/store/game/players/players.state';
import { Player } from '@shared/models/player.model';
import { defaultAvatarSrc } from '@shared/constants/avatars';
import { GameState } from '@shared/store/game/game.state';
import { Round } from '@shared/models/table/round.model';
import { CheckByDon } from '@shared/store/game/round/current-night/current-night.actions';
import { CurrentNightState } from '@shared/store/game/round/current-night/current-night.state';

@Component({
  selector: 'app-don',
  templateUrl: './don.component.html',
  styleUrls: ['./don.component.scss'],
})
export class DonComponent implements OnInit {
  @Select(PlayersState.getDon) don$: Observable<Player>;
  @Select(CurrentNightState.getDonCheck) donCheck$: Observable<string>;
  @Select(GameState.getRounds) rounds$: Observable<Round[]>;
  @Select(PlayersState.getPlayers) players$: Observable<Player[]>;

  currentPlayerIndex = 0;

  defaultAvatar = defaultAvatarSrc;

  constructor(private store: Store) { }

  ngOnInit() { }

  check() {
    const players = this.store.selectSnapshot(PlayersState.getPlayers);

    this.store.dispatch(new CheckByDon(players[this.currentPlayerIndex].user.id));
  }

  navigateToPlayer(playerNumber: number) {
    this.currentPlayerIndex = playerNumber - 1;
  }
}
