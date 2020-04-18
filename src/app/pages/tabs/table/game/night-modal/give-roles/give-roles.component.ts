import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';

import { TableState } from '@shared/store/table/table.state';
import { Player } from '@shared/models/player.model';
import { defaultAvatarSrc } from '@shared/constants/avatars';

@Component({
  selector: 'app-give-roles',
  templateUrl: './give-roles.component.html',
  styleUrls: ['./give-roles.component.scss'],
})
export class GiveRolesComponent implements OnInit {
  @Select(TableState.getPlayers) players$: Observable<Player[]>;

  players: Player[];

  defaultAvatar = defaultAvatarSrc;

  currentPlayerIndex = 0;
  isRoleVisible = false;
  isAllRolesVisible = false;
  hiddenRoleText = 'Нажмите, чтобы увидеть роль';
  showAllRolesText = 'Показать роли';
  hideAllRolesText = 'Скрыть роли';

  constructor() { }

  ngOnInit() {
    this.players$.subscribe((players) => this.players = players);
  }

  nextPlayer() {
    if (this.currentPlayerIndex < 9) {
      this.isRoleVisible = false;
      this.currentPlayerIndex++;
    }
  }

  revealRole() {
    this.isRoleVisible = true;
  }

  toggleAllRolesVisibility() {
    this.isAllRolesVisible = !this.isAllRolesVisible;
  }

  navigateToPlayer(playerNumber: number) {
    this.isRoleVisible = false;
    this.currentPlayerIndex = playerNumber - 1;
  }
}
