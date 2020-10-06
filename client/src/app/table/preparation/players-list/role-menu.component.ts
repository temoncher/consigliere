import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

import { Role } from '~/types/enums/role.enum';

@Component({
  selector: 'app-role-menu',
  template: `
    <ion-list>
      <ng-container *ngFor="let role of Role | keyvalue">
        <ion-item
          *ngIf="role.value !== Role.HOST && role.value !== Role.CREATOR"
          [attr.data-cy]="role.value"
          button
          lines="none"
          (click)="chooseRole(role.value)"
        >
          <!-- TODO: translate this-->
          {{ role.value }}
        </ion-item>
      </ng-container>
    </ion-list>
  `,
})
export class RoleMenuComponent implements OnInit {
  Role = Role;
  constructor(private popoverController: PopoverController) { }

  ngOnInit() {}

  chooseRole(role: Role) {
    this.popoverController.dismiss(role);
  }
}
