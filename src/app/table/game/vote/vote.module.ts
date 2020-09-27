import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RoundProgressModule } from 'angular-svg-round-progressbar';

import { SharedModule } from '@/shared/shared.module';

import { AdditionalSpeechComponent } from './additional-speech/additional-speech.component';
import { EliminateAllVoteComponent } from './eliminate-all-vote/eliminate-all-vote.component';
import { VoteResultsComponent } from './vote-results/vote-results.component';
import { VoteStageComponent } from './vote-stage/vote-stage.component';
import { VoteComponent } from './vote.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RoundProgressModule,
    SharedModule,
  ],
  declarations: [
    VoteComponent,
    VoteStageComponent,
    EliminateAllVoteComponent,
    AdditionalSpeechComponent,
    VoteResultsComponent,
  ],
  exports: [
    VoteComponent,
  ],
})
export class VoteModule { }
