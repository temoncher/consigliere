import { Component, OnInit, Input } from '@angular/core';
import { defaultAvatarSrc } from '@shared/constants/avatars';
import { Player } from '@shared/models/player.model';

@Component({
  selector: 'app-result-list',
  templateUrl: './result-list.component.html',
  styleUrls: ['./result-list.component.scss'],
})
export class ResultListComponent implements OnInit {
  @Input() players: Player[];

  defaultAvatar = defaultAvatarSrc;

  constructor() { }

  ngOnInit() {}
}
