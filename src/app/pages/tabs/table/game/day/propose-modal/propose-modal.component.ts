import { Component, OnInit, OnDestroy } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';

import { Player } from '@shared/models/player.model';
import { defaultAvatarSrc } from '@shared/constants/avatars';
import { ModalController } from '@ionic/angular';
import { CurrentDayState } from '@shared/store/game/current-day/current-day.state';
import { PlayersState } from '@shared/store/game/players/players.state';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-propose-modal',
  templateUrl: './propose-modal.component.html',
  styleUrls: ['./propose-modal.component.scss'],
})
export class ProposeModalComponent implements OnInit, OnDestroy {
  private destory: Subject<boolean> = new Subject<boolean>();
  @Select(PlayersState.getPlayers) players$: Observable<Player[]>;
  @Select(CurrentDayState.getProposedPlayers) proposedPlayers$: Observable<Map<string, string>>;

  players: Player[];
  proposedPlayers: Map<string, string> = new Map<string, string>();

  defaultAvatar = defaultAvatarSrc;

  currentPlayerIndex = 0;

  constructor(
    private modalController: ModalController,
  ) { }

  ngOnInit() {
    this.proposedPlayers$
      .pipe(takeUntil(this.destory))
      .subscribe((proposedPlayers) => this.proposedPlayers = proposedPlayers);
    this.players$
      .pipe(takeUntil(this.destory))
      .subscribe((players) => this.players = players);

    this.currentPlayerIndex = this.players.findIndex((player) => !player.quitPhase && !this.isAlreadyACandidate(player.user.id));
  }

  ngOnDestroy() {
    this.destory.next();
    this.destory.unsubscribe();
  }

  navigateToPlayer(player: Player) {
    this.currentPlayerIndex = player.number - 1;
  }

  isAlreadyACandidate(playerId: string) {
    return this.proposedPlayers.has(playerId);
  }

  proposePlayer() {
    this.modalController.dismiss(this.players[this.currentPlayerIndex], 'propose');
  }

  close() {
    this.modalController.dismiss(null, 'cancel');
  }

}