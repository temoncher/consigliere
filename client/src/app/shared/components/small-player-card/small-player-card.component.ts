import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  OnDestroy,
} from '@angular/core';
import { Store } from '@ngxs/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Player } from '@/shared/models/player.model';
import { PlayersState } from '@/table/store/players/players.state';
import { CurrentDayState } from '@/table/store/round/current-day/current-day.state';

import { Role } from '~types/enums/role.enum';

@Component({
  selector: 'app-small-player-card',
  templateUrl: './small-player-card.component.html',
  styleUrls: ['./small-player-card.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class SmallPlayerCardComponent implements OnDestroy {
  private destroy: Subject<boolean> = new Subject<boolean>();
  @Input() playerId: string;
  @Input() showRole = false;
  @Input() showFalls = false;
  @Input() showTeam = false;
  @Input() showProposedPlayer = false;
  @Input() disabled = false;

  @Output() cardClick = new EventEmitter();

  player?: Player;
  proposedPlayer?: Player;
  playerQuitPhase?: string;
  playerRole: Role;

  Role = Role;

  fallsNumber = 0;

  constructor(private store: Store) {
    this.store.select(PlayersState.getPlayer(this.playerId))
      .pipe(takeUntil(this.destroy))
      .subscribe((player) => this.player = player);

    this.store.select(CurrentDayState.getProposedPlayer(this.playerId))
      .pipe(takeUntil(this.destroy))
      .subscribe((proposedPlayer) => this.proposedPlayer = proposedPlayer);

    this.store.select(PlayersState.getPlayerQuitPhase(this.playerId))
      .pipe(takeUntil(this.destroy))
      .subscribe((playerQuitPhase) => this.playerQuitPhase = playerQuitPhase);

    this.store.select(PlayersState.getPlayerFalls(this.playerId))
      .pipe(takeUntil(this.destroy))
      .subscribe((falls) => this.fallsNumber = falls);

    this.store.select(PlayersState.getPlayerRole(this.playerId))
      .pipe(takeUntil(this.destroy))
      .subscribe((role) => this.playerRole = role);
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.unsubscribe();
  }

  onClick(event: MouseEvent): void {
    event.stopPropagation();

    if (!this.disabled) {
      this.cardClick.emit(event);
    }
  }
}
