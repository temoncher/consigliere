import { Component, OnInit, Input } from '@angular/core';

import { defaultAvatarSrc } from '@/shared/constants/avatars';
import { Player } from '@/shared/models/player.model';

import { Role } from '~/types/enums/role.enum';

@Component({
  selector: 'app-result-list',
  templateUrl: './result-list.component.html',
  styleUrls: ['./result-list.component.scss'],
})
export class ResultListComponent implements OnInit {
  @Input() players: Player[];
  @Input() roles: Record<string, Role>;

  defaultAvatar = defaultAvatarSrc;

  constructor() { }

  ngOnInit() {}
}
