import {
  Component,
  Input,
  ViewChild,
  OnChanges,
  SimpleChanges,
  OnDestroy,
} from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { Store, Select } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SwiperOptions } from 'swiper';

import { Player } from '@/shared/models/player.model';
import { ToggleGameMenuBoolean } from '@/table/store/menu/game-menu.actions';
import { GameMenuState } from '@/table/store/menu/game-menu.state';
import { PlayersState } from '@/table/store/players/players.state';

import { IQuitPhase } from '~types/interfaces/quit-phase.interface';

@Component({
  selector: 'app-player-controls',
  templateUrl: './player-controls.component.html',
  styleUrls: ['./player-controls.component.scss'],
})
export class PlayerControlsComponent implements OnChanges, OnDestroy {
  private destroy: Subject<boolean> = new Subject<boolean>();
  @ViewChild('numberSlider') numberSlider: IonSlides;

  @Select(GameMenuState.getBasicProp('isPlayerControlsVisible')) isPlayerControlsOpened$: Observable<boolean>;
  @Select(GameMenuState.getBasicProp('isRolesVisible')) isRolesVisible$: Observable<boolean>;
  @Select(GameMenuState.getBasicProp('isQuittedHidden')) isQuittedHidden$: Observable<boolean>;
  @Select(PlayersState.getQuitPhases) quitPhases$: Observable<Record<string, IQuitPhase>>;

  @Input() showFalls = true;
  @Input() currentPlayerNumber = 0; // TODO: currently unused, implement sliding with speech end
  @Input() showProposedPlayers = true; // TODO: hide proposed players on vote?

  players: Player[];
  quitPhases: Record<string, IQuitPhase>;

  numberSliderConfig: SwiperOptions = {
    slidesPerView: 5.5,
    centeredSlides: true,
  };

  constructor(
    private store: Store,
  ) {
    this.quitPhases$
      .pipe(takeUntil(this.destroy))
      .subscribe((quitPhases) => this.quitPhases = quitPhases);

    this.players = this.store.selectSnapshot(PlayersState.getPlayers);
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.unsubscribe();
  }

  ngOnChanges({ currentPlayerNumber }: SimpleChanges): void {
    if (currentPlayerNumber && this.numberSlider) {
      this.navigateToSlide(currentPlayerNumber.currentValue);
    }
  }

  toggleControlsVisibility(): void {
    this.store.dispatch(new ToggleGameMenuBoolean('isPlayerControlsVisible'));
  }

  navigateToSlide(index: number): void {
    this.numberSlider.slideTo(index);
  }
}
