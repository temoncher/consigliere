import { Component, OnInit } from '@angular/core';
import { Player } from '@shared/models/player.model';
import { ModalController } from '@ionic/angular';

import { defaultAvatarSrc } from '@shared/constants/avatars';

@Component({
  selector: 'app-preparation-modal',
  templateUrl: './preparation-modal.component.html',
  styleUrls: ['./preparation-modal.component.scss'],
})
export class PreparationModalComponent implements OnInit {
  defaultAvatar = defaultAvatarSrc;
  addGuestText = 'Добавить гостя';
  toolbarTitle = 'Выбор игрока';
  players: Player[] = [];

  constructor(private modalController: ModalController) { }

  ngOnInit() {
    this.players = [
      new Player({ nickname: 'Temoncher', user: { id: 'temoncher' } }),
      new Player({ nickname: 'Cabby', user: { id: 'cabby' } }),
      new Player({ nickname: 'Булочка', user: { id: 'bulochka' } }),
      new Player({ nickname: 'Краснова', user: { id: 'krasnova' } }),
      new Player({ nickname: 'Олежа', user: { id: 'olega' } }),
      new Player({ nickname: 'Маффин', user: { id: 'maffin' } }),
      new Player({ nickname: 'Девяткин', user: { id: 'devyatkin' } }),
      new Player({ nickname: 'Одинаковый', user: { id: 'odynakoviy' } }),
      new Player({ nickname: 'Люба', user: { id: 'lyba' } }),
      new Player({ nickname: 'Углическая', user: { id: 'uglicheskaya' } }),
    ];
  }

  async choosePlayer(player?: Player) {
    const role = player ? 'authenticated' : 'guest';
    await this.modalController.dismiss(player, role);
  }

  async close() {
    await this.modalController.dismiss(undefined, 'cancel');
  }

}
