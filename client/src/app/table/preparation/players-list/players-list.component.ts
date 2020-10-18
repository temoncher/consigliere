import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController, ToastController, PopoverController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Select, Store } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { catchError, first } from 'rxjs/operators';

import { defaultAvatarSrc } from '@/shared/constants/avatars';
import { Player } from '@/shared/models/player.model';
import { ReorderPlayer, RemovePlayer, AssignRole, AddPlayer } from '@/table/store/players/players.actions';
import { PlayersState } from '@/table/store/players/players.state';

import { PlayerSuggestionsModalComponent } from '../player-suggestions-modal/player-suggestions-modal.component';

import { RoleMenuComponent } from './role-menu.component';

import { Role } from '~types/enums/role.enum';

interface IonicReorderEvent {
  detail: {
    from: number;
    to: number;
    complete: any;
  };
}

@Component({
  selector: 'app-players-list',
  templateUrl: 'players-list.component.html',
  styleUrls: ['players-list.component.scss'],
})
export class PlayersListComponent implements OnInit {
  @Select(PlayersState.getPlayers) players$: Observable<Player[]>;
  @Select(PlayersState.getHost) host$: Observable<Player>;
  @Select(PlayersState.getRoles) roles$: Observable<Record<string, Role>>;
  @Select(PlayersState.getValidRoles) validRoles$: Observable<Partial<Record<keyof typeof Role, boolean>>>;

  defaultAvatar = defaultAvatarSrc;

  playerPrompt: {
    header: string;
    namePlaceholder: string;
    cancelButton: string;
    confirmButton: string;
  };

  roles: Record<string, Role>;

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private toastController: ToastController,
    private popoverController: PopoverController,
    private translate: TranslateService,
    private store: Store,
  ) {
    this.translate.get('TABS.TABLE.PREPARATION.PLAYERS_LIST.playerPrompt')
      .subscribe((playerPrompt) => this.playerPrompt = playerPrompt);

    this.roles$.subscribe((roles) => this.roles = roles);
  }

  ngOnInit() { }

  async doReorder({ detail: { from, to, complete } }: IonicReorderEvent) {
    await this.store.dispatch(new ReorderPlayer(from, to)).toPromise();
    complete();
  }

  removePlayer(playerId: string) {
    this.store.dispatch(new RemovePlayer(playerId));
  }

  changeRole(playerId: string) {
    this.store.dispatch(new AssignRole(playerId, Role.DON));
  }

  getPlayersRole(player: Player) {
    return this.roles[player.uid];
  }

  async presentRolesMenu(playerId: string) {
    const popover = await this.popoverController.create({
      component: RoleMenuComponent,
      translucent: true,
    });

    await popover.present();
    const { data: role } = await popover.onWillDismiss();

    this.store.dispatch(new AssignRole(playerId, role));
  }

  async presentPlayerModal() {
    const modal = await this.modalController.create({
      component: PlayerSuggestionsModalComponent,
      swipeToClose: true,
    });

    await modal.present();
    this.awaitPlayerModalResult(modal);
  }

  private async presentPlayerPrompt() {
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
          cssClass: 'cancel-button',
          text: this.playerPrompt.cancelButton,
          role: 'cancel',
        },
        {
          cssClass: 'submit-button',
          text: this.playerPrompt.confirmButton,
          handler: ({ nickname }: { nickname: string }) => {
            this.addNewPlayer(new Player({ nickname }));
          },
        },
      ],
    });

    await prompt.present();

    document.getElementById('nickname-input').focus();
  }

  private async awaitPlayerModalResult(modal: HTMLIonModalElement) {
    const { data: user, role } = await modal.onWillDismiss();

    if (role === 'authenticated') {
      this.addNewPlayer(new Player(user));

      return;
    }

    if (role === 'guest') {
      this.presentPlayerPrompt();
    }
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
