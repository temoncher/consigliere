import { Component } from '@angular/core';
import { IonRouterOutlet } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.component.html',
  styleUrls: ['tabs.component.scss'],
})
export class TabsComponent {
  constructor(
    private routerOutlet: IonRouterOutlet,
  ) {
    this.disableIosSwipeBack();
  }

  disableIosSwipeBack() {
    this.routerOutlet.swipeGesture = false;
  }
}
