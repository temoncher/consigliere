import { Component, OnInit, Input, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { Store } from '@ngxs/store';
import { IonSlides } from '@ionic/angular';
import { Observable } from 'rxjs';

import { Player } from '@shared/models/player.model';
import { PlayersState } from '@shared/store/game/players/players.state';
import { ToggleGameMenuBoolean } from '@shared/store/game/menu/menu.actions';
import { GameMenuState } from '@shared/store/game/menu/menu.state';
@Component({
  selector: 'app-player-controls',
  templateUrl: './player-controls.component.html',
  styleUrls: ['./player-controls.component.scss'],
})
export class PlayerControlsComponent implements OnInit, OnChanges {
  @ViewChild('numberSlider') numberSlider: IonSlides;

  isPlayerControlsOpened$: Observable<boolean>;

  @Input() showRoles = false;
  @Input() showFalls = true;
  @Input() currentPlayerNumber = 0;
  @Input() showProposedPlayers = false;

  players: Player[];

  numberSliderConfig = {
    slidesPerView: 5.5,
    centeredSlides: true,
  };
  menuPropName = 'isPlayerControlsVisible';

  constructor(
    private store: Store,
  ) {
    this.players = this.store.selectSnapshot(PlayersState.getPlayers);
    this.isPlayerControlsOpened$ = this.store.select(GameMenuState.getBasicProp(this.menuPropName));
  }

  ngOnInit() {
    setTimeout(() => {
      // TODO: Remove crutch for slider config update
      this.numberSliderConfig = {
        slidesPerView: 5.5,
        centeredSlides: true,
      };
    }, 0);
  }

  ngOnChanges({ currentPlayerNumber }: SimpleChanges) {
    if (currentPlayerNumber && this.numberSlider) {
      this.navigateToSlide(currentPlayerNumber.currentValue);
    }
  }

  toggleControlsVisibility() {
    this.store.dispatch(new ToggleGameMenuBoolean(this.menuPropName));
  }

  navigateToSlide(index: number) {
    this.numberSlider.slideTo(index);
  }
}
