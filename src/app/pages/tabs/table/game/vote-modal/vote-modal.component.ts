import { Component, OnInit } from '@angular/core';
import { SwitchDayPhase } from '@shared/store/table/current-day/current-day.actions';
import { DayPhase } from '@shared/models/day-phase.enum';
import { Store } from '@ngxs/store';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-vote-modal',
  templateUrl: './vote-modal.component.html',
  styleUrls: ['./vote-modal.component.scss'],
})
export class VoteModalComponent implements OnInit {
  nextPhaseText = 'Далее';
  toolbarTitle = 'Голосование';

  constructor(
    private store: Store,
    private modalController: ModalController,
  ) { }

  ngOnInit() { }

  close() {
    this.store.dispatch(new SwitchDayPhase(DayPhase.NIGHT));
    this.modalController.dismiss();
  }
}
