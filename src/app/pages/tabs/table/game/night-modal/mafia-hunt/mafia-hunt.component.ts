import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';

import { Player } from '@shared/models/player.model';
import { Role } from '@shared/models/role.enum';
import { defaultAvatarSrc } from '@shared/constants/avatars';
import { PlayersState } from '@shared/store/game/players/players.state';
import { Day } from '@shared/models/table/day.model';
import { CurrentDayState, CurrentDayStateModel } from '@shared/store/game/current-day/current-day.state';
import { ShootPlayer } from '@shared/store/game/current-day/current-day.actions';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-mafia-hunt',
  templateUrl: './mafia-hunt.component.html',
  styleUrls: ['./mafia-hunt.component.scss'],
})
export class MafiaHuntComponent implements OnInit, OnDestroy {
  private destory: Subject<boolean> = new Subject<boolean>();
  @Output() nextClick = new EventEmitter();

  @Select(PlayersState.getPlayers) players$: Observable<Player[]>;
  @Select(CurrentDayState.getDay) day$: Observable<CurrentDayStateModel>;

  Role = Role;
  defaultAvatar = defaultAvatarSrc;

  players: Player[];
  mafia: Player[];
  day: CurrentDayStateModel;

  currentPlayerIndex = 0;
  skipButtonText = 'Пропустить';
  nextStageButtonText = 'Далее';

  get numberOfShots() {
    return this.day.shots.size;
  }

  constructor(private store: Store) {
    this.store.select(PlayersState.getPlayersByRoles([Role.MAFIA, Role.DON]))
      .pipe(takeUntil(this.destory))
      .subscribe((mafiaPlayers) => this.mafia = mafiaPlayers);
    this.players$
      .pipe(takeUntil(this.destory))
      .subscribe((players) => this.players = players);
    this.day$
      .pipe(takeUntil(this.destory))
      .subscribe((day) => this.day = day);
  }

  ngOnInit() { }

  ngOnDestroy() {
    this.destory.next();
    this.destory.unsubscribe();
  }

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
