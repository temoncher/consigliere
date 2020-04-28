import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { SharedModule } from '@shared/shared.module';
import { VoteModalComponent } from './vote-modal.component';
import { VoteStageComponent } from './vote-stage/vote-stage.component';
import { EliminateAllVoteComponent } from './eliminate-all-vote/eliminate-all-vote.component';
import { AdditionalSpeechComponent } from './additional-speech/additional-speech.component';
import { VoteResultsComponent } from './vote-results/vote-results.component';
import { RoundProgressModule } from 'angular-svg-round-progressbar';
@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SharedModule,
    RoundProgressModule,
  ],
  declarations: [
    VoteModalComponent,
    VoteStageComponent,
    EliminateAllVoteComponent,
    AdditionalSpeechComponent,
    VoteResultsComponent,
  ],
})
export class VoteModalModule { }
