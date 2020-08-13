import { Component, OnInit } from '@angular/core';
import { Player } from '@shared/models/player.model';
import { ModalController, AlertController, ToastController } from '@ionic/angular';
import { Store, Select } from '@ngxs/store';
import { catchError, first } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

import { defaultAvatarSrc } from '@shared/constants/avatars';
import { PlayersState } from '@shared/store/game/players/players.state';
import { ShufflePlayers, SetHost } from '@shared/store/game/players/players.actions';
import { TranslateService } from '@ngx-translate/core';
import { GameService } from '@shared/services/game.service';
import { PreparationModalComponent } from './preparation-modal/preparation-modal.component';

interface HostPropmt {
  header: string;
  namePlaceholder: string;
  cancelButton: string;
  confirmButton: string;
}

@Component({
  selector: 'app-preparation',
  templateUrl: './preparation.component.html',
  styleUrls: ['./preparation.component.scss'],
})
export class PreparationComponent implements OnInit {
  @Select(PlayersState.getPlayers) players$: Observable<Player[]>;
  @Select(PlayersState.getHost) host$: Observable<Player>;
  defaultAvatar = defaultAvatarSrc;

  private hostPropmpt: HostPropmt;

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private toastController: ToastController,
    private gameService: GameService,
    private translate: TranslateService,
    private store: Store,
  ) {
    this.translate.get('TABS.TABLE.PREPARATION.hostPropmpt')
      .subscribe((hostPropmpt) => this.hostPropmpt = hostPropmpt);
  }

  ngOnInit() { }

  shufflePlayers() {
    this.store.dispatch(new ShufflePlayers());
  }

  start() {
    this.gameService.startGame();
  }

  async presentHostModal() {
    const modal = await this.modalController.create({
      component: PreparationModalComponent,
      swipeToClose: true,
    });

    await modal.present();
    this.awaitHostModalResult(modal);
  }

  private async awaitHostModalResult(modal: HTMLIonModalElement) {
    const { data: player, role } = await modal.onWillDismiss();

    switch (role) {
      case 'authenticated':
        this.setHost(player);

        return;
      case 'guest':
        this.presentHostPrompt();
        break;
      default:
        break;
    }
  }

  async presentHostPrompt() {
    const prompt = await this.alertController.create({
      header: this.hostPropmpt.header,
      inputs: [
        {
          name: 'nickname',
          type: 'text',
          placeholder: this.hostPropmpt.namePlaceholder,
        },
      ],
      buttons: [
        {
          text: this.hostPropmpt.cancelButton,
          role: 'cancel',
        }, {
          text: this.hostPropmpt.confirmButton,
          handler: (player) => this.setHost(player),
        },
      ],
    });

    await prompt.present();
  }

  private setHost(player: Player) {
    this.store.dispatch(new SetHost(player))
      .pipe(
        first(),
        catchError((err) => {
          this.displayToast(err.message, 'danger');

          return of('');
        }),
      ).subscribe();
  }

  private async displayToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      color,
      duration: 3000,
    });

    toast.present();
  }
}
