import { roundActionsPrefix } from '../round.actions';

const nightActionsPrefix = `${roundActionsPrefix}.CurrentNight`;

export class ShootPlayer {
  static readonly type = `[${nightActionsPrefix}] Shoot player`;
  constructor(
    public mafiaId: string,
    public victimId: string,
  ) { }
}

export class EndNight {
  static readonly type = `[${nightActionsPrefix}] End night`;
  constructor() { }
}
