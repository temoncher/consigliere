import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { environment } from 'src/environments/environment';

import { defaultAvatarSrc } from '@/shared/constants/avatars';
import { Player } from '@/shared/models/player.model';

const dummySuggestions = [
  new Player({ nickname: 'Temoncher', user: { uid: 'temoncher', nickname: 'temoncher' } }),
  new Player({ nickname: 'Cabby', user: { uid: 'cabby', nickname: 'cabby' } }),
  new Player({ nickname: 'Булочка', user: { uid: 'bulochka', nickname: 'bulochka' } }),
  new Player({ nickname: 'Краснова', user: { uid: 'krasnova', nickname: 'krasnova' } }),
  new Player({ nickname: 'Олежа', user: { uid: 'olega', nickname: 'olega' } }),
  new Player({ nickname: 'Маффин', user: { uid: 'maffin', nickname: 'maffin' } }),
  new Player({ nickname: 'Девяткин', user: { uid: 'devyatkin', nickname: 'devyatkin' } }),
  new Player({ nickname: 'Одинаковый', user: { uid: 'odynakoviy', nickname: 'odynakoviy' } }),
  new Player({ nickname: 'Люба', user: { uid: 'lyba', nickname: 'lyba' } }),
  new Player({ nickname: 'Углическая', user: { uid: 'uglicheskaya', nickname: 'uglicheskaya' } }),
];

@Component({
  selector: 'app-preparation-modal',
  templateUrl: './preparation-modal.component.html',
})
export class PreparationModalComponent implements OnInit {
  defaultAvatar = defaultAvatarSrc;
  players: Player[] = [];

  constructor(private modalController: ModalController) { }

  ngOnInit() {
    this.players = environment.production ? [] : dummySuggestions;
  }

  choosePlayer(player?: Player) {
    const role = player ? 'authenticated' : 'guest';

    this.modalController.dismiss(player, role);
  }

  close() {
    this.modalController.dismiss(undefined, 'cancel');
  }
}
