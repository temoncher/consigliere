import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { TableState } from '@shared/store/table/table.state';
import { Day } from '@shared/models/table/day.model';
import { StartNewDay } from '@shared/store/table/table.day.actions';
import { Player } from '@shared/models/player.model';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  @Select(TableState.getDays) days$: Observable<Day[]>;
  @Select(TableState.getPlayers) players$: Observable<Player[]>;

  dayText = 'День';

  constructor(
    private store: Store,
    private modalController: ModalController,
  ) { }

  ngOnInit() {
    this.store.dispatch(new StartNewDay());
  }

  endSpeech() {}
  proposePlayer() {}
  withdrawPlayer() {}
}
