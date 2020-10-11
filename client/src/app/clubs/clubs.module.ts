import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { SharedModule } from '@/shared/shared.module';

import { ClubAdminComponent } from './club-details/club-admin/club-admin.component';
import { ClubDetailsComponent } from './club-details/club-details.component';
import { ClubsListComponent } from './clubs-list/clubs-list.component';
import { ClubsComponent } from './clubs.component';
import { CreateClubComponent } from './create-club/create-club.component';
import { JoinClubComponent } from './join-club/join-club.component';

const routes: Routes = [
  {
    path: ':clubId',
    component: ClubDetailsComponent,
  },
  {
    path: ':clubId/admin',
    component: ClubAdminComponent,
  },
  {
    path: '',
    component: ClubsComponent,
  },
];

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ],
  declarations: [
    ClubsComponent,
    ClubsListComponent,
    CreateClubComponent,
    JoinClubComponent,
    ClubDetailsComponent,
    ClubAdminComponent,
  ],
})
export class ClubsModule {}
