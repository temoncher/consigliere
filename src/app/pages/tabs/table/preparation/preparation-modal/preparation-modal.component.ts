import { Component, OnInit } from '@angular/core';
import { Player } from '@shared/models/player.model';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-preparation-modal',
  templateUrl: './preparation-modal.component.html',
  styleUrls: ['./preparation-modal.component.scss'],
})
export class PreparationModalComponent implements OnInit {
  addGuestText = 'Добавить гостя';
  players: Player[] = [];

  constructor(private modalController: ModalController) { }

  ngOnInit() {
    this.players = [
      new Player({ nickname: 'Temoncher' }),
      new Player({ nickname: 'Cabby' }),
      new Player({ nickname: 'Булочка' }),
      new Player({ nickname: 'Краснова' }),
      new Player({ nickname: 'Олежа' }),
    ];
  }

  async choosePlayer(player: Player) {
    await this.modalController.dismiss(player);
  }

}
