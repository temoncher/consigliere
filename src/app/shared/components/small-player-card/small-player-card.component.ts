import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';

import { Player } from '@shared/models/player.model';
import { Role } from '@shared/models/role.enum';
import { DayPhase } from '@shared/models/day-phase.enum';
import { Store } from '@ngxs/store';
import { PlayersState } from '@shared/store/table/players/players.state';
import { CurrentDayState } from '@shared/store/table/current-day/current-day.state';

@Component({
  selector: 'app-small-player-card',
  templateUrl: './small-player-card.component.html',
  styleUrls: ['./small-player-card.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class SmallPlayerCardComponent implements OnInit {
  @Input() playerId: string;
  @Input() showRole = false;
  @Input() showFalls = false;
  @Input() showTeam = false;
  @Input() showProposedPlayer = false;
  @Input() overlayCondition = false;
  @Input() overlayText = '';
  @Input() useSlot = false;
  @Input() disabled = false;

  @Output() click = new EventEmitter();

  player: Player;
  proposedPlayer: Player;

  Role = Role;

  get quitPhase() {
    if (this.player.quitPhase) {
      return `${this.player.quitPhase.number}${(this.player.quitPhase.stage === DayPhase.NIGHT ? 'н' : 'д')}`;
    }

    return '';
  }

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.select(PlayersState.getPlayer(this.playerId))
      .subscribe((player) => this.player = player);
    this.store.select(CurrentDayState.getProposedPlayer(this.playerId))
    .subscribe((proposedPlayer) => this.proposedPlayer = proposedPlayer);
  }

  onClick(event: MouseEvent) {
    event.stopPropagation();
    if (!this.disabled) {
      this.click.emit(event);
    }
  }
}
