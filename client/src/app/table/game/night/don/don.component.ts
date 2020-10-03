import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { defaultAvatarSrc } from '@/shared/constants/avatars';
import { Player } from '@/shared/models/player.model';
import { PlayersState } from '@/table/store/players/players.state';
import { CheckByDon } from '@/table/store/round/current-night/current-night.actions';
import { CurrentNightState } from '@/table/store/round/current-night/current-night.state';

@Component({
  selector: 'app-don',
  templateUrl: './don.component.html',
  styleUrls: ['./don.component.scss'],
})
export class DonComponent implements OnInit {
  @Output() nextClick = new EventEmitter();

  @Select(PlayersState.getDon) don$: Observable<Player>;
  @Select(CurrentNightState.getDonCheck) donCheck$: Observable<string>;
  @Select(PlayersState.getPlayers) players$: Observable<Player[]>;

  checkedPlayerIndex?: number;
  currentPlayerIndex = 0;

  defaultAvatar = defaultAvatarSrc;

  constructor(private store: Store) {
    this.donCheck$.subscribe((checkedPlayerId) => {
      if (checkedPlayerId) {
        const checkedPlayer = this.store.selectSnapshot(PlayersState.getPlayer(checkedPlayerId));

        this.checkedPlayerIndex = checkedPlayer.number - 1;
      }
    });
  }

  ngOnInit() { }

  check() {
    const players = this.store.selectSnapshot(PlayersState.getPlayers);

    this.store.dispatch(new CheckByDon(players[this.currentPlayerIndex].uid));
  }

  next() {
    this.nextClick.emit();
  }

  navigateToPlayer(playerNumber: number) {
    this.currentPlayerIndex = playerNumber - 1;
  }
}