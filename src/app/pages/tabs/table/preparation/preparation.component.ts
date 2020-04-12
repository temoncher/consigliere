import { Component, OnInit } from '@angular/core';
import { Player } from '@shared/models/player.model';
import { ModalController, AlertController } from '@ionic/angular';
import { PreparationModalComponent } from './preparation-modal/preparation-modal.component';

@Component({
  selector: 'app-preparation',
  templateUrl: './preparation.component.html',
  styleUrls: ['./preparation.component.scss'],
})
export class PreparationComponent implements OnInit {
  players: Player[] = [];

  private alertText = {
    header: 'Как зовут гостя?',
    namePlaceholder: 'Каспер',
    cancelButton: 'Отмена',
    confirmButton: 'Ок',
  };
  addNewPlayerText = 'Добавить нового игрока';
  guestText = 'Гость';

  constructor(private modalController: ModalController,
              private alertController: AlertController) { }

  ngOnInit() {
  }

  async addNewPlayer(modal) {
    const modalOutput = await modal.onWillDismiss();
    console.log(modalOutput);
    if (modalOutput.data) {
      this.players.push(modalOutput.data);
      return;
    }

    await this.presentPrompt();
  }

  async presentPrompt() {
    const prompt = await this.alertController.create({
      header: this.alertText.header,
      inputs: [
        {
          name: 'nickname',
          type: 'text',
          placeholder: this.alertText.namePlaceholder
        },
      ],
      buttons: [
        {
          text: this.alertText.cancelButton,
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: this.alertText.confirmButton,
          handler: (player) => {
            this.players.push(player);
          }
        }
      ]
    });

    await prompt.present();
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: PreparationModalComponent
    });

    await modal.present();
    await this.addNewPlayer(modal);
  }

}
