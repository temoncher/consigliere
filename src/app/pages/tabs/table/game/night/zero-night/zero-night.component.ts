import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Select } from '@ngxs/store';
import { defaultAvatarSrc } from '@shared/constants/avatars';
import { colors } from '@shared/constants/colors';
import { playerSliderConfig } from '@shared/constants/slider';
import { Player } from '@shared/models/player.model';
import { Timer } from '@shared/models/table/timer.model';
import { PlayersState } from '@shared/store/game/players/players.state';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-zero-night',
  templateUrl: './zero-night.component.html',
  styleUrls: ['./zero-night.component.scss'],
})
export class ZeroNightComponent implements OnInit, OnDestroy {
  @Output() nextClick = new EventEmitter();

  @Select(PlayersState.getDon) don$: Observable<Player>;
  @Select(PlayersState.getSheriff) sheriff$: Observable<Player>;

  colors = colors;
  defaultAvatar = defaultAvatarSrc;
  playerSliderConfig = playerSliderConfig;

  time = 20;
  sheriffTimer = new Timer({ time: this.time });

  constructor() { }

  ngOnInit() {}

  ngOnDestroy() {
    this.sheriffTimer.pauseTimer();
  }

  nextStage() {
    this.nextClick.emit();
  }

  switchTimer() {
    this.sheriffTimer.switchTimer();
  }
}
