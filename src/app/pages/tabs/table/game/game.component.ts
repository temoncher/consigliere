import { Component, OnInit } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { AlertController, MenuController } from '@ionic/angular';
import { Select, Store } from '@ngxs/store';
import { RoundPhase } from '@shared/models/table/day-phase.enum';
import { GameResult } from '@shared/models/table/game-result.enum';
import { GameState } from '@shared/store/game/game.state';
import { RoundState } from '@shared/store/game/round/round.state';
import { StateReset } from 'ngxs-reset-plugin';
import { from, Observable } from 'rxjs';

interface DiscardGamePrompt {
  header: string;
  text: string;
  stayButton: string;
  leaveButton: string;
}

enum DiscardGameOptions {
  LEAVE = 'LEAVE',
  STAY = 'STAY',
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit, CanDeactivate<GameComponent> {
  @Select(GameState.getGameResult) gameResult$: Observable<GameResult>;
  @Select(RoundState.getRoundPhase) currentPhase$: Observable<RoundPhase>;
  @Select(GameState.getRoundNumber) roundNumber$: Observable<number>;

  RoundPhase = RoundPhase;

  // TODO: translate this
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
    return from(this.presentHostPrompt());
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
            this.store.dispatch(new StateReset(GameState));
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
