import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController, AlertController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Store, Select } from '@ngxs/store';
import { of, Observable, Subject, combineLatest } from 'rxjs';
import { catchError, first, takeUntil } from 'rxjs/operators';

import { defaultAvatarSrc } from '@/shared/constants/avatars';
import { Player } from '@/shared/models/player.model';
import { Role } from '@/shared/models/role.enum';
import { GameService } from '@/table/services/game.service';

import { ShufflePlayers, SetHost } from '../store/players/players.actions';
import { PlayersState } from '../store/players/players.state';

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
export class PreparationComponent implements OnInit, OnDestroy {
  private destroy: Subject<boolean> = new Subject<boolean>();

  @Select(PlayersState.getPlayers) players$: Observable<Player[]>;
  @Select(PlayersState.getHost) host$: Observable<Player>;
  @Select(PlayersState.getRolesNumbers) rolesNumbers$: Observable<Partial<Record<keyof typeof Role, number>>>;
  @Select(PlayersState.getValidRoles) validRoles$: Observable<Partial<Record<keyof typeof Role, boolean>>>;
  defaultAvatar = defaultAvatarSrc;

  private hostPropmpt: HostPropmt;
  readyPlayersNumber = 0;

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private toastController: ToastController,
    private gameService: GameService,
    private translate: TranslateService,
    private store: Store,
  ) {
    this.translate.get('TABS.TABLE.PREPARATION.hostPropmpt')
      .pipe(takeUntil(this.destroy))
      .subscribe((hostPropmpt) => this.hostPropmpt = hostPropmpt);

    combineLatest([this.rolesNumbers$, this.validRoles$])
      .pipe(takeUntil(this.destroy))
      .subscribe(([rolesNumbers, validRoles]) => {
        this.readyPlayersNumber = Object.entries(rolesNumbers)
          .reduce((readyPlayersNumber, [role, playersNumber]) => (
            validRoles[role]
              ? readyPlayersNumber + playersNumber
              : readyPlayersNumber
          ), 0);
      });
  }

  ngOnInit() { }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.unsubscribe();
  }

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
          id: 'nickname-input',
          type: 'text',
          placeholder: this.hostPropmpt.namePlaceholder,
        },
      ],
      buttons: [
        {
          cssClass: 'cancel-button',
          text: this.hostPropmpt.cancelButton,
          role: 'cancel',
        }, {
          cssClass: 'submit-button',
          text: this.hostPropmpt.confirmButton,
          handler: (player) => this.setHost(player),
        },
      ],
    });

    await prompt.present();
    document.getElementById('nickname-input').focus();
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
