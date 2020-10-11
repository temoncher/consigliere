import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { SharedModule } from '@/shared/shared.module';

import { ProfileComponent } from './profile.component';
import { SettingsMenuComponent } from './settings-menu.component';

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
