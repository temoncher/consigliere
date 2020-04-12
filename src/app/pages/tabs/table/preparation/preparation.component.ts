import { Component, OnInit } from '@angular/core';
import { Player } from '@shared/models/player.model';
import { ModalController, AlertController, ToastController } from '@ionic/angular';
import { Store, Select } from '@ngxs/store';
import { catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

import { PreparationModalComponent } from './preparation-modal/preparation-modal.component';
import { TableState } from '@shared/store/table/table.state';
import { AddPlayer, RemovePlayer } from '@shared/store/table/table.actions';
import { defaultAvatarSrc } from '@shared/constants/avatars';

@Component({
  selector: 'app-preparation',
  templateUrl: './preparation.component.html',
  styleUrls: ['./preparation.component.scss'],
})
export class PreparationComponent implements OnInit {
  @Select(TableState.getPlayers) players$: Observable<Player[]>;
  defaultAvatar = defaultAvatarSrc;

  private alertText = {
    header: 'Как зовут гостя?',
    namePlaceholder: 'Каспер',
    cancelButton: 'Отмена',
    confirmButton: 'Добавить',
  };
  addNewPlayerText = 'Добавить нового игрока';
  guestText = 'Гость';

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private toastController: ToastController,
    private store: Store,
  ) { }

  ngOnInit() {
  }

  removePlayer({ user: { id } }: Player) {
    this.store.dispatch(new RemovePlayer(id));
  }

  async awaitModalResult(modal) {
    const { data: player, role } = await modal.onWillDismiss();

    if (role === 'authenticated') {
      this.addNewPlayer(player);
      return;
    }

    if (role === 'guest') {
      await this.presentPrompt();
      return;
    }
  }

  async presentPrompt() {
    const prompt = await this.alertController.create({
      header: this.alertText.header,
      inputs: [
        {
          name: 'nickname',
          type: 'text',
          placeholder: this.alertText.namePlaceholder
        },
      ],
      buttons: [
        {
          text: this.alertText.cancelButton,
          role: 'cancel'
        }, {
          text: this.alertText.confirmButton,
          handler: (player) => this.addNewPlayer(player)
        }
      ]
    });

    await prompt.present();
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: PreparationModalComponent,
      swipeToClose: true,
    });

    await modal.present();
    await this.awaitModalResult(modal);
  }

  private addNewPlayer(player: Player) {
    this.store.dispatch(new AddPlayer(player))
      .pipe(
        catchError((err) => {
          this.displayToast(err.message, 'danger');
          return of('');
        })
      ).subscribe();
  }

  private async displayToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      color,
      duration: 3000
    });

    toast.present();
  }

}
