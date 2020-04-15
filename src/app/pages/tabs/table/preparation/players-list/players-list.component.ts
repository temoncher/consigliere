import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { TableState } from '@shared/store/table/table.state';
import { Observable, of } from 'rxjs';
import { Player } from '@shared/models/player.model';
import { defaultAvatarSrc } from '@shared/constants/avatars';
import { ModalController, AlertController, ToastController } from '@ionic/angular';
import { PreparationModalComponent } from '../preparation-modal/preparation-modal.component';
import { AddPlayer, RemovePlayer } from '@shared/store/table/table.player.actions';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-players-list',
  templateUrl: './players-list.component.html',
  styleUrls: ['./players-list.component.scss'],
})
export class PlayersListComponent implements OnInit {
  @Select(TableState.getPlayers) players$: Observable<Player[]>;
  @Select(TableState.getHost) host$: Observable<Player>;
  defaultAvatar = defaultAvatarSrc;

  private playerPromptText = {
    header: 'Как зовут гостя?',
    namePlaceholder: 'Каспер',
    cancelButton: 'Отмена',
    confirmButton: 'Добавить',
  };
  addNewPlayerText = 'Добавить нового игрока';
  guestText = 'Гость';
  authorizedUserText = 'Участник';

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private toastController: ToastController,
    private store: Store,
  ) { }

  ngOnInit() { }

  removePlayer({ user: { id } }: Player) {
    this.store.dispatch(new RemovePlayer(id));
  }

  async presentPlayerModal() {
    const modal = await this.modalController.create({
      component: PreparationModalComponent,
      swipeToClose: true,
    });

    await modal.present();
    await this.awaitPlayerModalResult(modal);
  }

  private async awaitPlayerModalResult(modal: HTMLIonModalElement) {
    const { data: player, role } = await modal.onWillDismiss();

    if (role === 'authenticated') {
      this.addNewPlayer(player);
      return;
    }

    if (role === 'guest') {
      await this.presentPlayerPrompt();
      return;
    }
  }

  async presentPlayerPrompt() {
    const prompt = await this.alertController.create({
      header: this.playerPromptText.header,
      inputs: [
        {
          name: 'nickname',
          type: 'text',
          placeholder: this.playerPromptText.namePlaceholder
        },
      ],
      buttons: [
        {
          text: this.playerPromptText.cancelButton,
          role: 'cancel'
        }, {
          text: this.playerPromptText.confirmButton,
          handler: (player) => this.addNewPlayer(player)
        }
      ]
    });

    await prompt.present();
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
