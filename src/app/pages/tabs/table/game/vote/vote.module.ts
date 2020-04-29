import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { RoundProgressModule } from 'angular-svg-round-progressbar';

import { SharedModule } from '@shared/shared.module';
import { VoteComponent } from './vote.component';
import { VoteStageComponent } from './vote-stage/vote-stage.component';
import { EliminateAllVoteComponent } from './eliminate-all-vote/eliminate-all-vote.component';
import { AdditionalSpeechComponent } from './additional-speech/additional-speech.component';
import { VoteResultsComponent } from './vote-results/vote-results.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SharedModule,
    RoundProgressModule,
  ],
  declarations: [
    VoteComponent,
    VoteStageComponent,
    EliminateAllVoteComponent,
    AdditionalSpeechComponent,
    VoteResultsComponent,
  ],
})
export class VoteModule { }
