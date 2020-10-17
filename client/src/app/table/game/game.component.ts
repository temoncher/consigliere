import { Component, OnInit } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { AlertController, MenuController } from '@ionic/angular';
import { Select, Store } from '@ngxs/store';
import { StateReset } from 'ngxs-reset-plugin';
import { from, Observable } from 'rxjs';

import { RoundState } from '../store/round/round.state';
import { TableState } from '../store/table.state';

import { GameResult } from '~types/enums/game-result.enum';
import { RoundPhase } from '~types/enums/round-phase.enum';

interface DiscardGamePrompt {
  header: string;
  text: string;
  stayButton: string;
  leaveButton: string;
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit, CanDeactivate<GameComponent> {
  @Select(TableState.getGameResult) gameResult$: Observable<GameResult>;
  @Select(RoundState.getRoundPhase) currentPhase$: Observable<RoundPhase>;
  @Select(TableState.getRoundNumber) roundNumber$: Observable<number>;

  RoundPhase = RoundPhase;

  private readonly discardGamePrompt: DiscardGamePrompt = {
    header: 'Вы уже уходите?',
    text: 'Игра не сохранится, если вы уйдете сейчас :(',
    stayButton: 'Остаться',
    leaveButton: 'Уйти',
  };

  constructor(
    private store: Store,
    private menuController: MenuController,
    private alertController: AlertController,
  ) { }

  ngOnInit() { }

  canDeactivate(): boolean | Observable<boolean> {
    const isGameStarted = this.store.selectSnapshot(TableState.getIsGameStarted);

    if (isGameStarted) {
      return from(this.presentHostPrompt());
    }

    return true;
  }

  openMenu() {
    this.menuController.open('game-menu');
  }

  private async presentHostPrompt() {
    let resolveLeaving: (value?: boolean | PromiseLike<boolean>) => void;

    const canLeave = new Promise<boolean>((resolve) => resolveLeaving = resolve);
    const prompt = await this.alertController.create({
      header: this.discardGamePrompt.header,
      message: this.discardGamePrompt.text,
      buttons: [
        {
          cssClass: 'leave-button',
          text: this.discardGamePrompt.leaveButton,
          handler: () => {
            this.store.dispatch(new StateReset(TableState));
            resolveLeaving(true);
          },
        }, {
          cssClass: 'stay-button',
          text: this.discardGamePrompt.stayButton,
          handler: () => resolveLeaving(false),
        },
      ],
    });

    await prompt.present();

    return canLeave;
  }
}
