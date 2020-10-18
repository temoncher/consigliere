import { Component, OnDestroy } from '@angular/core';
import { ModalController, AlertController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Store, Select } from '@ngxs/store';
import { of, Observable, Subject, combineLatest } from 'rxjs';
import { catchError, first, takeUntil } from 'rxjs/operators';

import { defaultAvatarSrc } from '@/shared/constants/avatars';
import { Player, IPlayer } from '@/shared/models/player.model';

import { GameService } from '../services/game.service';
import { ShufflePlayers, SetHost } from '../store/players/players.actions';
import { PlayersState } from '../store/players/players.state';

import { PlayerSuggestionsModalComponent } from './player-suggestions-modal/player-suggestions-modal.component';

import { Role } from '~types/enums/role.enum';

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
export class PreparationComponent implements OnDestroy {
  private destroy: Subject<boolean> = new Subject<boolean>();

  @Select(PlayersState.getPlayers) players$: Observable<Player[]>;
  @Select(PlayersState.getHost) host$: Observable<Player | null>;
  @Select(PlayersState.getRolesNumbers) rolesNumbers$: Observable<Partial<Record<keyof typeof Role, number>>>;
  @Select(PlayersState.getValidRoles) validRoles$: Observable<Partial<Record<keyof typeof Role, boolean>>>;
  defaultAvatar = defaultAvatarSrc;

  private hostPropmpt: HostPropmt;
  readyPlayersNumber = 0;
  host: IPlayer | null;

  constructor(
    private store: Store,
    private gameService: GameService,
    private translate: TranslateService,
    private modalController: ModalController,
    private alertController: AlertController,
    private toastController: ToastController,
  ) {
    this.host$
      .pipe(takeUntil(this.destroy))
      .subscribe((host) => this.host = host);

    this.translate.get('TABS.TABLE.PREPARATION.hostPropmpt')
      .pipe(takeUntil(this.destroy))
      .subscribe((hostPropmpt) => this.hostPropmpt = hostPropmpt);

    combineLatest([this.rolesNumbers$, this.validRoles$])
      .pipe(takeUntil(this.destroy))
      .subscribe(([rolesNumbers, validRoles]) => {
        this.readyPlayersNumber = Object.entries(rolesNumbers)
          .reduce((readyPlayersNumber, [role, playersNumber]) => (
            validRoles[role as Role]
              ? readyPlayersNumber + (playersNumber || 0)
              : readyPlayersNumber
          ), 0);
      });
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.unsubscribe();
  }

  shufflePlayers(): void {
    this.store.dispatch(new ShufflePlayers());
  }

  start(): void {
    this.gameService.startGame();
  }

  async presentHostModal(): Promise<void> {
    const modal = await this.modalController.create({
      component: PlayerSuggestionsModalComponent,
      swipeToClose: true,
    });

    await modal.present();
    this.awaitHostModalResult(modal);
  }

  private async awaitHostModalResult(modal: HTMLIonModalElement): Promise<void> {
    const { data: user, role } = await modal.onWillDismiss();

    switch (role) {
      case 'authenticated':
        this.setHost(new Player(user));

        return;
      case 'guest':
        this.presentHostPrompt();
        break;
      default:
        break;
    }
  }

  async presentHostPrompt(): Promise<void> {
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
          handler: ({ nickname }: { nickname: string }): void => {
            this.setHost(new Player({ nickname }));
          },
        },
      ],
    });

    await prompt.present();
    document.getElementById('nickname-input')?.focus();
  }

  private setHost(player: Player): void {
    this.store.dispatch(new SetHost(player))
      .pipe(
        first(),
        catchError((err) => {
          this.displayToast(err.message, 'danger');

          return of('');
        }),
      ).subscribe();
  }

  private async displayToast(message: string, color: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      color,
      duration: 3000,
    });

    toast.present();
  }
}
