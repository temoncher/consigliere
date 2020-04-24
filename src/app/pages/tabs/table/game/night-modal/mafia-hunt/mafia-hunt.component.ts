import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { Player } from '@shared/models/player.model';
import { Role } from '@shared/models/role.enum';
import { defaultAvatarSrc } from '@shared/constants/avatars';
import { PlayersState } from '@shared/store/table/players/players.state';
import { Day } from '@shared/models/day.model';
import { CurrentDayState } from '@shared/store/table/current-day/current-day.state';
import { ShootPlayer } from '@shared/store/table/current-day/current-day.actions';

@Component({
  selector: 'app-mafia-hunt',
  templateUrl: './mafia-hunt.component.html',
  styleUrls: ['./mafia-hunt.component.scss'],
})
export class MafiaHuntComponent implements OnInit {
  @Output() nextClick = new EventEmitter();

  @Select(PlayersState.getPlayers) players$: Observable<Player[]>;
  @Select(CurrentDayState.getDay) day$: Observable<Day>;
  Role = Role;
  defaultAvatar = defaultAvatarSrc;

  players: Player[];
  mafia: Player[];
  day: Day;

  currentPlayerIndex = 0;
  skipButtonText = 'Пропустить';
  nextStageButtonText = 'Далее';

  get numberOfShots() {
    return this.day.shots.size;
  }

  constructor(private store: Store) {
    this.store.select(PlayersState.getPlayersByRoles([Role.MAFIA, Role.DON]))
      .subscribe((mafiaPlayers) => this.mafia = mafiaPlayers);
    this.players$.subscribe((players) => this.players = players);
    this.day$.subscribe((day) => this.day = day);
  }

  ngOnInit() { }

  next() {
    this.nextClick.emit();
  }

  navigateToPlayer(playerNumber: number) {
    this.currentPlayerIndex = playerNumber - 1;
  }

  shootPlayer(mafiaPlayerId: string) {
    this.store.dispatch(new ShootPlayer(mafiaPlayerId, this.players[this.currentPlayerIndex].user.id));
  }

  shotPlayerId(mafiaPlayerId: string) {
    return this.day.shots.get(mafiaPlayerId);
  }
}
