import {
  Component, OnInit, Input, ViewChild, OnChanges, SimpleChanges,
} from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { IonSlides } from '@ionic/angular';
import { Observable } from 'rxjs';

import { Player } from '@shared/models/player.model';
import { PlayersState } from '@shared/store/game/players/players.state';
import { ToggleGameMenuBoolean } from '@shared/store/game/menu/menu.actions';
import { GameMenuState } from '@shared/store/game/menu/menu.state';
import { SwiperOptions } from 'swiper';
import { QuitPhase } from '@shared/models/quit-phase.interface';

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
  @Select(PlayersState.getQuitPhases) quitPhases$: Observable<Map<string, QuitPhase>>;

  @Input() showFalls = true;
  @Input() currentPlayerNumber = 0;
  @Input() showProposedPlayers = false;

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
