import { Component, OnInit, Input } from '@angular/core';

import { Player } from '@shared/models/player.model';
import { Role } from '@shared/models/role.enum';
import { DayTime } from '@shared/models/day-time.enum';

@Component({
  selector: 'app-small-player-card',
  templateUrl: './small-player-card.component.html',
  styleUrls: ['./small-player-card.component.scss'],
})
export class SmallPlayerCardComponent implements OnInit {
  @Input() player: Player;
  @Input() showRole = false;
  @Input() showTeam = false;
  @Input() disableOverlay = false;
  @Input() overlayCondition = null;
  @Input() overlayText = null;

  Role = Role;

  get quitPhase() {
    if (this.player.quitPhase) {
      return `${this.player.quitPhase.number} + ${(this.player.quitPhase.stage === DayTime.NIGHT ? 'н' : 'д')}`;
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

  constructor() { }

  ngOnInit() { }

}
