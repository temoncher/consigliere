import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';

import { Role } from '~types/enums/role.enum';

@Component({
  selector: 'app-role-menu',
  template: `
    <ion-list>
      <ng-container *ngFor="let role of Role | keyvalue">
        <ion-item
          *ngIf="role.value !== Role.HOST"
          [attr.data-cy]="role.value"
          button
          lines="none"
          (click)="chooseRole(role.value)"
        >
          {{ "ROLE." + role.value | translate }}
        </ion-item>
      </ng-container>
    </ion-list>
  `,
})
export class RoleMenuComponent {
  Role = Role;
  constructor(private popoverController: PopoverController) { }

  chooseRole(role: Role): void {
    this.popoverController.dismiss(role);
  }
}
