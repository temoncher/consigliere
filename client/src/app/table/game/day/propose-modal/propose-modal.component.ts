import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { defaultAvatarSrc } from '@/shared/constants/avatars';
import { Player } from '@/shared/models/player.model';
import { PlayersState } from '@/table/store/players/players.state';
import { CurrentDayState } from '@/table/store/round/current-day/current-day.state';

import { IQuitPhase } from '~types/interfaces/quit-phase.interface';

@Component({
  selector: 'app-propose-modal',
  templateUrl: './propose-modal.component.html',
  styleUrls: ['./propose-modal.component.scss'],
})
export class ProposeModalComponent implements OnDestroy {
  private destroy: Subject<boolean> = new Subject<boolean>();
  @Select(PlayersState.getPlayers) players$: Observable<Player[]>;
  @Select(CurrentDayState.getProposedPlayers) proposedPlayers$: Observable<Record<string, string>>;
  @Select(PlayersState.getQuitPhases) quitPhases$: Observable<Record<string, IQuitPhase>>;

  players: Player[];
  proposedPlayers: Record<string, string> = {};
  quitPhases: Record<string, IQuitPhase>;

  defaultAvatar = defaultAvatarSrc;

  currentPlayerIndex = 0;

  constructor(
    private modalController: ModalController,
    private store: Store,
  ) {
    this.quitPhases$
      .pipe(takeUntil(this.destroy))
      .subscribe((quitPhases) => this.quitPhases = quitPhases);

    this.proposedPlayers$
      .pipe(takeUntil(this.destroy))
      .subscribe((proposedPlayers) => this.proposedPlayers = proposedPlayers);
    this.players$
      .pipe(takeUntil(this.destroy))
      .subscribe((players) => this.players = players);
    const quitPhases = this.store.selectSnapshot(PlayersState.getQuitPhases);

    this.currentPlayerIndex = this.players.findIndex(
      ({ uid }) => !quitPhases[uid] && !this.isAlreadyACandidate(uid),
    );
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.unsubscribe();
  }

  navigateToPlayer(player: Player): void {
    if (!player.number) throw new Error('Player has no number');

    this.currentPlayerIndex = player.number - 1;
  }

  isAlreadyACandidate(playerId: string): boolean {
    return Boolean(this.proposedPlayers[playerId]);
  }

  proposePlayer(): void {
    this.modalController.dismiss(this.players[this.currentPlayerIndex], 'propose');
  }

  close(): void {
    this.modalController.dismiss(null, 'cancel');
  }
}
