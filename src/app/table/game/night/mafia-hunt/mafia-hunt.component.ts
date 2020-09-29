import {
  Component, OnInit, Output, EventEmitter, OnDestroy,
} from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { defaultAvatarSrc } from '@/shared/constants/avatars';
import { Player } from '@/shared/models/player.model';
import { QuitPhase } from '@/shared/models/quit-phase.interface';
import { Role } from '@/shared/models/role.enum';
import { PlayersState } from '@/table/store/players/players.state';
import { ShootPlayer } from '@/table/store/round/current-night/current-night.actions';
import { CurrentNightState } from '@/table/store/round/current-night/current-night.state';

@Component({
  selector: 'app-mafia-hunt',
  templateUrl: './mafia-hunt.component.html',
  styleUrls: ['./mafia-hunt.component.scss'],
})
export class MafiaHuntComponent implements OnInit, OnDestroy {
  private destroy: Subject<boolean> = new Subject<boolean>();
  @Output() nextClick = new EventEmitter();

  @Select(PlayersState.getPlayers) players$: Observable<Player[]>;
  @Select(PlayersState.getQuitPhases) qutiPhases$: Observable<Record<string, QuitPhase>>;
  @Select(PlayersState.getPlayersByRoles([Role.MAFIA, Role.DON])) mafiaPlayers$: Observable<Player[]>;
  @Select(CurrentNightState.getShots) shots$: Observable<Record<string, string>>;
  @Select(CurrentNightState.getVictims) victimsMap$: Observable<Map<string, string[]>>;

  Role = Role;
  defaultAvatar = defaultAvatarSrc;

  players: Player[];
  shots: Record<string, string>;
  aliveMafia: Player[];

  currentPlayerIndex = 0;

  get numberOfShots() {
    const shots = this.store.selectSnapshot(CurrentNightState.getShots);

    return Object.keys(shots).length;
  }

  constructor(private store: Store) {
    combineLatest([this.mafiaPlayers$, this.qutiPhases$])
      .pipe(takeUntil(this.destroy))
      .subscribe(
        ([mafiaPlayers, quitPhases]) => this.aliveMafia = mafiaPlayers.filter(({ uid }) => !quitPhases[uid]),
      );

    this.players$
      .pipe(takeUntil(this.destroy))
      .subscribe((players) => this.players = players);

    this.shots$
      .pipe(takeUntil(this.destroy))
      .subscribe((shots) => this.shots = shots);
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
    this.store.dispatch(new ShootPlayer(mafiaPlayerId, this.players[this.currentPlayerIndex].uid));
  }

  currentShot(mafia: Player) {
    return this.shots[mafia.uid];
  }
}
