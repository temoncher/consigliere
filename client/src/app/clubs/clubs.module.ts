import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { SharedModule } from '@/shared/shared.module';

import { ClubsListComponent } from './clubs-list/clubs-list.component';
import { ClubsComponent } from './clubs.component';
import { CreateClubComponent } from './create-club/create-club.component';
import { JoinClubComponent } from './join-club/join-club.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    RouterModule.forChild([{ path: '', component: ClubsComponent }]),
  ],
  declarations: [
    ClubsComponent,
    ClubsListComponent,
    CreateClubComponent,
    JoinClubComponent,
  ],
})
export class ClubsModule {}
