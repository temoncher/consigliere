import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { defaultAvatarSrc } from '@/shared/constants/avatars';
import { Player } from '@/shared/models/player.model';
import { PlayersState } from '@/table/store/players/players.state';
import { CheckBySheriff } from '@/table/store/round/current-night/current-night.actions';
import { CurrentNightState } from '@/table/store/round/current-night/current-night.state';

@Component({
  selector: 'app-sheriff',
  templateUrl: './sheriff.component.html',
  styleUrls: ['./sheriff.component.scss'],
})
export class SheriffComponent implements OnInit, OnDestroy {
  @Output() nextClick = new EventEmitter();

  @Select(PlayersState.getSheriff) sheriff$: Observable<Player>;
  @Select(CurrentNightState.getSheriffCheck) sheriffCheck$: Observable<string>;
  @Select(PlayersState.getPlayers) players$: Observable<Player[]>;

  defaultAvatar = defaultAvatarSrc;

  checkedPlayerIndex?: number;
  currentPlayerIndex = 0;

  constructor(private store: Store) { }

  ngOnInit() {
    this.sheriffCheck$.subscribe((checkedPlayerId) => {
      if (checkedPlayerId) {
        const checkedPlayer = this.store.selectSnapshot(PlayersState.getPlayer(checkedPlayerId));

        this.checkedPlayerIndex = checkedPlayer.number - 1;
      }
    });
  }

  ngOnDestroy() {
  }

  check() {
    const players = this.store.selectSnapshot(PlayersState.getPlayers);

    if (players) {
      this.store.dispatch(new CheckBySheriff(players[this.currentPlayerIndex].user.uid));
    }
  }

  next() {
    this.nextClick.emit();
  }

  navigateToPlayer(playerNumber: number) {
    this.currentPlayerIndex = playerNumber - 1;
  }
}
