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

  Role = Role;

  get quitPhase() {
    return `${this.player.quitPhase.number} + ${(this.player.quitPhase.stage === DayTime.NIGHT ? 'н' : 'д')}`;
  }

  constructor() { }

  ngOnInit() { }

}
