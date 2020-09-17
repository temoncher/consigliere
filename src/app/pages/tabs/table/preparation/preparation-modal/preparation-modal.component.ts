import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { defaultAvatarSrc } from '@shared/constants/avatars';
import { Player } from '@shared/models/player.model';

@Component({
  selector: 'app-preparation-modal',
  templateUrl: './preparation-modal.component.html',
  styleUrls: ['./preparation-modal.component.scss'],
})
export class PreparationModalComponent implements OnInit {
  defaultAvatar = defaultAvatarSrc;
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

  choosePlayer(player?: Player) {
    const role = player ? 'authenticated' : 'guest';

    this.modalController.dismiss(player, role);
  }

  close() {
    this.modalController.dismiss(undefined, 'cancel');
  }
}
