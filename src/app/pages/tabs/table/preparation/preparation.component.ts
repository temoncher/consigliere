import { Component, OnInit } from '@angular/core';
import { Player } from '@shared/models/player.model';
import { ModalController, AlertController, ToastController } from '@ionic/angular';
import { Store, Select } from '@ngxs/store';
import { catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

import { PreparationModalComponent } from './preparation-modal/preparation-modal.component';
import { defaultAvatarSrc } from '@shared/constants/avatars';
import { PlayersState } from '@shared/store/table/players/players.state';
import { ShufflePlayers, SetHost } from '@shared/store/table/players/players.actions';

@Component({
  selector: 'app-preparation',
  templateUrl: './preparation.component.html',
  styleUrls: ['./preparation.component.scss'],
})
export class PreparationComponent implements OnInit {
  @Select(PlayersState.getPlayers) players$: Observable<Player[]>;
  @Select(PlayersState.getHost) host$: Observable<Player>;
  defaultAvatar = defaultAvatarSrc;

  private hostPropmptText = {
    header: 'Как обращаться к новому ведущему?',
    namePlaceholder: 'Каспер',
    cancelButton: 'Отмена',
    confirmButton: 'Подтвердить',
  };
  setHostText = 'Выбрать ведущего';
  toolbarTitle = 'Подбор игроков';
  hostTitle = 'Ведущий';

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private toastController: ToastController,
    private store: Store,
  ) { }

  ngOnInit() { }

  shufflePlayers() {
    this.store.dispatch(new ShufflePlayers());
  }

  async presentHostModal() {
    const modal = await this.modalController.create({
      component: PreparationModalComponent,
      swipeToClose: true,
    });

    await modal.present();
    await this.awaitHostModalResult(modal);
  }

  private async awaitHostModalResult(modal: HTMLIonModalElement) {
    const { data: player, role } = await modal.onWillDismiss();

    if (role === 'authenticated') {
      this.setHost(player);
      return;
    }

    if (role === 'guest') {
      await this.presentHostPrompt();
      return;
    }
  }

  async presentHostPrompt() {
    const prompt = await this.alertController.create({
      header: this.hostPropmptText.header,
      inputs: [
        {
          name: 'nickname',
          type: 'text',
          placeholder: this.hostPropmptText.namePlaceholder,
        },
      ],
      buttons: [
        {
          text: this.hostPropmptText.cancelButton,
          role: 'cancel',
        }, {
          text: this.hostPropmptText.confirmButton,
          handler: (player) => this.setHost(player),
        },
      ],
    });

    await prompt.present();
  }

  private setHost(player: Player) {
    this.store.dispatch(new SetHost(player))
      .pipe(
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
