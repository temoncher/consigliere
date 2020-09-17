import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Player } from '@shared/models/player.model';
import { PlayersState } from '@shared/store/game/players/players.state';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-table-template',
  templateUrl: './table-template.component.html',
  styleUrls: ['./table-template.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class TableTemplateComponent implements OnInit {
  @Select(PlayersState.getPlayers) players$: Observable<Player[]>;

  constructor(private store: Store) { }

  ngOnInit() { }
}
