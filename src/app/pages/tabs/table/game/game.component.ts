import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { TableState } from '@shared/store/table/table.state';
import { Day } from '@shared/models/table/day.model';
import { StartNewDay } from '@shared/store/table/table.day.actions';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  @Select(TableState.getCurrentDay) day$: Observable<Day>;
  @Select(TableState.getDays) days$: Observable<Day[]>;
  dayText = 'День';

  constructor(
    private store: Store,
    private modalController: ModalController,
  ) { }

  ngOnInit() {
    this.store.dispatch(new StartNewDay());
  }
}
