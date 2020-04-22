import { Component, OnInit, Input } from '@angular/core';

import { Player } from '@shared/models/player.model';
import { Role } from '@shared/models/role.enum';
import { DayPhase } from '@shared/models/day-phase.enum';
import { Store } from '@ngxs/store';
import { PlayersState } from '@shared/store/table/players/players.state';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-small-player-card',
  templateUrl: './small-player-card.component.html',
  styleUrls: ['./small-player-card.component.scss'],
})
export class SmallPlayerCardComponent implements OnInit {
  @Input() playerId: string;
  @Input() showRole = false;
  @Input() showFalls = false;
  @Input() showTeam = false;
  @Input() disableOverlay = false;
  @Input() overlayCondition = null;
  @Input() overlayText = null;

  player: Player;

  Role = Role;

  get quitPhase() {
    if (this.player.quitPhase) {
      return `${this.player.quitPhase.number}${(this.player.quitPhase.stage === DayPhase.NIGHT ? 'н' : 'д')}`;
    }

    return '';
  }

  get isOverlayVisible() {
    if (this.disableOverlay) {
      return false;
    }

    if (this.overlayCondition !== null) {
      return this.overlayCondition;
    }

    return this.quitPhase;
  }

  get computedOverlayText() {
    if (this.overlayCondition === null) {
      return this.quitPhase;
    }

    return this.overlayText;
  }

  constructor(private store: Store) {
  }

  ngOnInit() {
    this.store.select(PlayersState.getPlayer(this.playerId))
      .subscribe((player) => this.player = player);
  }

}
