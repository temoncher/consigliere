import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { Player } from '@shared/models/player.model';
import { Role } from '@shared/models/role.enum';
import { defaultAvatarSrc } from '@shared/constants/avatars';
import { PlayersState } from '@shared/store/table/players/players.state';

@Component({
  selector: 'app-mafia-hunt',
  templateUrl: './mafia-hunt.component.html',
  styleUrls: ['./mafia-hunt.component.scss'],
})
export class MafiaHuntComponent implements OnInit {
  @Select(PlayersState.getPlayers) players$: Observable<Player[]>;

  Role = Role;
  defaultAvatar = defaultAvatarSrc;

  players: Player[];
  mafia: Player[];

  currentPlayerIndex = 0;
  skipButtonText = 'Пропустить';

  constructor() { }

  ngOnInit() {
    this.players$.subscribe((players) => {
      this.players = players;
      this.mafia = players.filter((player) => !player.quitPhase && (player.role === Role.MAFIA || player.role === Role.DON));
    });
  }

}
