import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-player-menu',
  templateUrl: './player-menu.component.html',
  styleUrls: ['./player-menu.component.scss'],
})
export class PlayerMenuComponent implements OnInit {
  refreshText = 'Сбросить игрока';
  fallText = 'Зафиксировать фол';
  viewProfileText = 'Открыть профиль';
  closeText = 'Закрыть меню';

  constructor(private popoverController: PopoverController) { }

  ngOnInit() { }

  chooseOption(role: string) {
    this.popoverController.dismiss(null, role);
  }

  dismissPopover() {
    this.popoverController.dismiss(null, 'cancel');
  }
}
