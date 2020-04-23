import { Component, OnInit, Input, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { Store } from '@ngxs/store';
import { IonSlides } from '@ionic/angular';
import { Observable } from 'rxjs';

import { Player } from '@shared/models/player.model';
import { PlayersState } from '@shared/store/table/players/players.state';
@Component({
  selector: 'app-player-controls',
  templateUrl: './player-controls.component.html',
  styleUrls: ['./player-controls.component.scss'],
})
export class PlayerControlsComponent implements OnInit, OnChanges {
  @ViewChild('numberSlider') numberSlider: IonSlides;

  @Input() showRoles = false;
  @Input() currentPlayerNumber = 0;
  @Input() showProposedPlayers = false;

  players: Player[];
  numberSliderConfig = {
    slidesPerView: 5.5,
    centeredSlides: true,
  };

  constructor(
    private store: Store,
  ) {
    this.players = this.store.selectSnapshot(PlayersState.getPlayers);
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

  navigateToSlide(index: number) {
    this.numberSlider.slideTo(index);
  }
}
