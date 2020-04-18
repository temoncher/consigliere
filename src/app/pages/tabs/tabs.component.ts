import { Component } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.component.html',
  styleUrls: ['tabs.component.scss'],
})
export class TabsComponent {
  searchTitle = 'Поиск';
  clubsTitle = 'Клубы';
  tableTitle = 'Стол';
  profileTitle = 'Профиль';

  constructor() {}
}
