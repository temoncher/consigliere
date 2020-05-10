import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Player } from '@shared/models/player.model';
import { Role } from '@shared/models/role.enum';
import { defaultAvatarSrc } from '@shared/constants/avatars';
import { PlayersState } from '@shared/store/game/players/players.state';
import { CurrentNightState } from '@shared/store/game/round/current-night/current-night.state';
import { ShootPlayer } from '@shared/store/game/round/current-night/current-night.actions';
import { QuitPhase } from '@shared/models/quit-phase.interface';

@Component({
  selector: 'app-mafia-hunt',
  templateUrl: './mafia-hunt.component.html',
  styleUrls: ['./mafia-hunt.component.scss'],
})
export class MafiaHuntComponent implements OnInit, OnDestroy {
  private destroy: Subject<boolean> = new Subject<boolean>();
  @Output() nextClick = new EventEmitter();

  @Select(PlayersState.getPlayers) players$: Observable<Player[]>;
  @Select(PlayersState.getQuitPhases) qutiPhases$: Observable<Map<string, QuitPhase>>;
  @Select(PlayersState.getPlayersByRoles([Role.MAFIA, Role.DON])) mafiaPlayers$: Observable<Player[]>;
  @Select(CurrentNightState.getShots) shots$: Observable<Map<string, string>>;
  @Select(CurrentNightState.getVictims) victimsMap$: Observable<Map<string, string[]>>;

  Role = Role;
  defaultAvatar = defaultAvatarSrc;

  players: Player[];
  aliveMafia: Player[];

  currentPlayerIndex = 0;

  constructor(private store: Store) {
    combineLatest([this.mafiaPlayers$, this.qutiPhases$])
      .pipe(takeUntil(this.destroy))
      .subscribe(([mafiaPlayers, quitPhases]) => this.aliveMafia = mafiaPlayers.filter(({ user: { id } }) => !quitPhases.has(id)));

    this.players$
      .pipe(takeUntil(this.destroy))
      .subscribe((players) => this.players = players);
  }

  ngOnInit() { }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.unsubscribe();
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
}
