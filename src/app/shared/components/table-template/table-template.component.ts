import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';

import { TableState } from '@shared/store/table/table.state';
import { Player } from '@shared/models/player.model';

@Component({
  selector: 'app-table-template',
  templateUrl: './table-template.component.html',
  styleUrls: ['./table-template.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class TableTemplateComponent implements OnInit {
  @Select(TableState.getPlayers) players$: Observable<Player[]>;

  constructor(private store: Store) { }

  ngOnInit() { }

}
