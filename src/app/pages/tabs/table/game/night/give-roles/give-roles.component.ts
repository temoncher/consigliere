import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { Player } from '@shared/models/player.model';
import { defaultAvatarSrc } from '@shared/constants/avatars';
import { PlayersState } from '@shared/store/game/players/players.state';
import { GameMenuState } from '@shared/store/game/menu/menu.state';

@Component({
  selector: 'app-give-roles',
  templateUrl: './give-roles.component.html',
  styleUrls: ['./give-roles.component.scss'],
})
export class GiveRolesComponent implements OnInit {
  @Select(PlayersState.getPlayers) players$: Observable<Player[]>;
  @Select(GameMenuState.getBasicProp('isRolesVisible')) isRolesVisible$: Observable<boolean>;

  defaultAvatar = defaultAvatarSrc;

  currentPlayerIndex = 0;
  isRoleVisible = false;

  constructor(private store: Store) { }

  ngOnInit() { }

  nextPlayer() {
    if (this.currentPlayerIndex < 9) {
      this.isRoleVisible = false;
      this.currentPlayerIndex++;
    }
  }

  revealRole() {
    this.isRoleVisible = true;
  }

  navigateToPlayer(playerNumber: number) {
    this.isRoleVisible = false;
    this.currentPlayerIndex = playerNumber - 1;
  }
}
