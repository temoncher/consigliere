import {
  Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation, OnDestroy,
} from '@angular/core';
import { Store } from '@ngxs/store';
import { Player } from '@shared/models/player.model';
import { Role } from '@shared/models/role.enum';
import { PlayersState } from '@shared/store/game/players/players.state';
import { CurrentDayState } from '@shared/store/game/round/current-day/current-day.state';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-small-player-card',
  templateUrl: './small-player-card.component.html',
  styleUrls: ['./small-player-card.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class SmallPlayerCardComponent implements OnInit, OnDestroy {
  private destroy: Subject<boolean> = new Subject<boolean>();
  @Input() playerId: string;
  @Input() showRole = false;
  @Input() showFalls = false;
  @Input() showTeam = false;
  @Input() showProposedPlayer = false;
  @Input() disabled = false;

  @Output() cardClick = new EventEmitter();

  player: Player;
  proposedPlayer: Player;
  playerQuitPhase: string;

  Role = Role;

  fallsNumber = 0;

  constructor(private store: Store) { }

  ngOnInit() {
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
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.unsubscribe();
  }

  onClick(event: MouseEvent) {
    event.stopPropagation();

    if (!this.disabled) {
      this.cardClick.emit(event);
    }
  }
}
