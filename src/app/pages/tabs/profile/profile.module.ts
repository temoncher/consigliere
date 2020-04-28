import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ProfileComponent } from './profile.component';
import { SharedModule } from '@shared/shared.module';
import { SettingsMenuComponent } from './settings-menu/settings-menu.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild([{ path: '', component: ProfileComponent }]),
  ],
  declarations: [
    ProfileComponent,
    SettingsMenuComponent,
  ],
})
export class ProfileModule { }
