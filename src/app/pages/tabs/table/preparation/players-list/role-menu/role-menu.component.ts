import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Role } from '@shared/models/role.enum';

@Component({
  selector: 'app-role-menu',
  templateUrl: './role-menu.component.html',
  styleUrls: ['./role-menu.component.scss'],
})
export class RoleMenuComponent implements OnInit {
  Role = Role;
  constructor(private popoverController: PopoverController) { }

  ngOnInit() {}

  chooseRole(role: Role) {
    this.popoverController.dismiss(role);
  }
}
