import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';

import { defaultAvatarSrc } from '@/shared/constants/avatars';
import { colors } from '@/shared/constants/colors';
import { playerSliderConfig } from '@/shared/constants/slider';
import { Player } from '@/shared/models/player.model';
import { Timer } from '@/table/models/timer.model';
import { PlayersState } from '@/table/store/players/players.state';

@Component({
  selector: 'app-zero-night',
  templateUrl: './zero-night.component.html',
  styleUrls: ['./zero-night.component.scss'],
})
export class ZeroNightComponent implements OnDestroy {
  @Output() nextClick = new EventEmitter();

  @Select(PlayersState.getDon) don$: Observable<Player>;
  @Select(PlayersState.getSheriff) sheriff$: Observable<Player>;

  colors = colors;
  defaultAvatar = defaultAvatarSrc;
  playerSliderConfig = playerSliderConfig;

  time = 20;
  sheriffTimer = new Timer({ time: this.time });

  ngOnDestroy(): void {
    this.sheriffTimer.pauseTimer();
  }

  nextStage(): void {
    this.nextClick.emit();
  }

  switchTimer(): void {
    this.sheriffTimer.switchTimer();
  }
}
