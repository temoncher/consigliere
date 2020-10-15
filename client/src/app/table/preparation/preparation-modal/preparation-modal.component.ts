import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { defaultAvatarSrc } from '@/shared/constants/avatars';
import { Player } from '@/shared/models/player.model';
import { IUser } from '@/shared/models/user.interface';

@Component({
  selector: 'app-preparation-modal',
  templateUrl: './preparation-modal.component.html',
  styles: [`
    .add-new {
      flex: 1;
    }
  `],
})
export class PreparationModalComponent implements OnInit {
  defaultAvatar = defaultAvatarSrc;
  @Input() users: IUser[];

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
