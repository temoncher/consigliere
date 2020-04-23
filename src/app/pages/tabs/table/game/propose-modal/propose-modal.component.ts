import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';

import { Player } from '@shared/models/player.model';
import { defaultAvatarSrc } from '@shared/constants/avatars';
import { ModalController } from '@ionic/angular';
import { CurrentDayState } from '@shared/store/table/current-day/current-day.state';
import { PlayersState } from '@shared/store/table/players/players.state';

@Component({
  selector: 'app-propose-modal',
  templateUrl: './propose-modal.component.html',
  styleUrls: ['./propose-modal.component.scss'],
})
export class ProposeModalComponent implements OnInit {
  @Select(PlayersState.getPlayers) players$: Observable<Player[]>;
  @Select(CurrentDayState.getProposedPlayers) proposedPlayers$: Observable<Map<string, string>>;

  players: Player[];
  proposedPlayers: Map<string, string> = new Map<string, string>();

  defaultAvatar = defaultAvatarSrc;

  currentPlayerIndex = 0;

  toolbarTitle = 'Выставить игрока';
  proposeButtonText = 'Выставить';

  constructor(
    private modalController: ModalController,
  ) { }

  ngOnInit() {
    this.proposedPlayers$.subscribe((proposedPlayers) => this.proposedPlayers = proposedPlayers);
    this.players$.subscribe((players) => this.players = players);

    this.currentPlayerIndex = this.players.findIndex((player) => !player.quitPhase && !this.isAlreadyACandidate(player.user.id));
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
