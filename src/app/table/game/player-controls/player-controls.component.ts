import {
  Component, OnInit, Input, ViewChild, OnChanges, SimpleChanges,
} from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { SwiperOptions } from 'swiper';

import { Player } from '@/shared/models/player.model';
import { QuitPhase } from '@/shared/models/quit-phase.interface';
import { ToggleGameMenuBoolean } from '@/table/store/menu/game-menu.actions';
import { GameMenuState } from '@/table/store/menu/game-menu.state';
import { PlayersState } from '@/table/store/players/players.state';

@Component({
  selector: 'app-player-controls',
  templateUrl: './player-controls.component.html',
  styleUrls: ['./player-controls.component.scss'],
})
export class PlayerControlsComponent implements OnInit, OnChanges {
  @ViewChild('numberSlider') numberSlider: IonSlides;
  @Select(GameMenuState.getBasicProp('isPlayerControlsVisible')) isPlayerControlsOpened$: Observable<boolean>;
  @Select(GameMenuState.getBasicProp('isRolesVisible')) isRolesVisible$: Observable<boolean>;
  @Select(GameMenuState.getBasicProp('isQuittedHidden')) isQuittedHidden$: Observable<boolean>;
  @Select(PlayersState.getQuitPhases) quitPhases$: Observable<Record<string, QuitPhase>>;

  @Input() showFalls = true;
  @Input() currentPlayerNumber = 0; // TODO: currently unused, implement sliding with speech end
  @Input() showProposedPlayers = true; // TODO: hide proposed players on vote?

  players: Player[];

  numberSliderConfig: SwiperOptions = {
    slidesPerView: 5.5,
    centeredSlides: true,
  };

  constructor(
    private store: Store,
  ) {
    this.players = this.store.selectSnapshot(PlayersState.getPlayers);
  }

  ngOnInit() { }

  ngOnChanges({ currentPlayerNumber }: SimpleChanges) {
    if (currentPlayerNumber && this.numberSlider) {
      this.navigateToSlide(currentPlayerNumber.currentValue);
    }
  }

  toggleControlsVisibility() {
    this.store.dispatch(new ToggleGameMenuBoolean('isPlayerControlsVisible'));
  }

  navigateToSlide(index: number) {
    this.numberSlider.slideTo(index);
  }
}
