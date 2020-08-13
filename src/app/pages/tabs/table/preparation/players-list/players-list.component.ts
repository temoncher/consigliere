import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { ModalController, AlertController, ToastController } from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { catchError, first } from 'rxjs/operators';

import { Player } from '@shared/models/player.model';
import { defaultAvatarSrc } from '@shared/constants/avatars';
import { PlayersState } from '@shared/store/game/players/players.state';
import { RemovePlayer, AddPlayer, ReorderPlayer } from '@shared/store/game/players/players.actions';
import { TranslateService } from '@ngx-translate/core';
import { PreparationModalComponent } from '../preparation-modal/preparation-modal.component';

interface IonicReorderEvent {
  detail: {
    from: number;
    to: number;
    complete: any;
  };
}

@Component({
  selector: 'app-players-list',
  templateUrl: './players-list.component.html',
  styleUrls: ['./players-list.component.scss'],
})
export class PlayersListComponent implements OnInit {
  @Select(PlayersState.getPlayers) players$: Observable<Player[]>;
  @Select(PlayersState.getHost) host$: Observable<Player>;

  defaultAvatar = defaultAvatarSrc;

  playerPrompt: {
    header: string;
    namePlaceholder: string;
    cancelButton: string;
    confirmButton: string;
  };

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private toastController: ToastController,
    private translate: TranslateService,
    private store: Store,
  ) {
    this.translate.get('TABS.TABLE.PREPARATION.PLAYERS_LIST.playerPrompt')
      .subscribe((playerPrompt) => this.playerPrompt = playerPrompt);
  }

  ngOnInit() { }

  doReorder({ detail: { from, to, complete } }: IonicReorderEvent) {
    this.store.dispatch(new ReorderPlayer(from, to));
    complete();
  }

  removePlayer({ user: { id } }: Player) {
    this.store.dispatch(new RemovePlayer(id));
  }

  async presentPlayerModal() {
    const modal = await this.modalController.create({
      component: PreparationModalComponent,
      swipeToClose: true,
    });

    await modal.present();
    this.awaitPlayerModalResult(modal);
  }

  private async awaitPlayerModalResult(modal: HTMLIonModalElement) {
    const { data: player, role } = await modal.onWillDismiss();

    if (role === 'authenticated') {
      this.addNewPlayer(player);

      return;
    }

    if (role === 'guest') {
      this.presentPlayerPrompt();
    }
  }

  async presentPlayerPrompt() {
    const prompt = await this.alertController.create({
      header: this.playerPrompt.header,
      inputs: [
        {
          id: 'nickname-input',
          name: 'nickname',
          type: 'text',
          placeholder: this.playerPrompt.namePlaceholder,
        },
      ],
      buttons: [
        {
          text: this.playerPrompt.cancelButton,
          role: 'cancel',
        },
        {
          text: this.playerPrompt.confirmButton,
          handler: (player) => this.addNewPlayer(player),
        },
      ],
    });

    await prompt.present();
  }

  private addNewPlayer(player: Player) {
    this.store.dispatch(new AddPlayer(player))
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
