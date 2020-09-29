import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { environment } from 'src/environments/environment';

import { defaultAvatarSrc } from '@/shared/constants/avatars';
import { Player } from '@/shared/models/player.model';
import { IUser } from '@/shared/models/user.interface';

const dummySuggestions: IUser[] = [
  { nickname: 'Temoncher', uid: 'temoncher' },
  { nickname: 'Cabby', uid: 'cabby' },
  { nickname: 'Булочка', uid: 'bulochka' },
  { nickname: 'Краснова', uid: 'krasnova' },
  { nickname: 'Олежа', uid: 'olega' },
  { nickname: 'Маффин', uid: 'maffin' },
  { nickname: 'Девяткин', uid: 'devyatkin' },
  { nickname: 'Одинаковый', uid: 'odynakoviy' },
  { nickname: 'Люба', uid: 'lyba' },
  { nickname: 'Углическая', uid: 'uglicheskaya' },
];

@Component({
  selector: 'app-preparation-modal',
  templateUrl: './preparation-modal.component.html',
})
export class PreparationModalComponent implements OnInit {
  defaultAvatar = defaultAvatarSrc;
  users: IUser[] = environment.production ? [] : dummySuggestions;

  constructor(private modalController: ModalController) { }

  ngOnInit() { }

  choosePlayer(player?: Player) {
    const role = player ? 'authenticated' : 'guest';

    this.modalController.dismiss(player, role);
  }

  close() {
    this.modalController.dismiss(undefined, 'cancel');
  }
}
