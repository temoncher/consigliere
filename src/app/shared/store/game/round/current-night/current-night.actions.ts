import { roundActionsPrefix } from '../round.actions';

const nightActionsPrefix = `${roundActionsPrefix}.CurrentNight`;

export class ShootPlayer {
  static readonly type = `[${nightActionsPrefix}] Shoot player`;
  constructor(
    public mafiaId: string,
    public victimId: string,
  ) { }
}

export class CheckByDon {
  static readonly type = `[${nightActionsPrefix}] Don check`;
  constructor(public playerId: string) { }
}

export class CheckBySheriff {
  static readonly type = `[${nightActionsPrefix}] Sheriff check`;
  constructor(public playerId: string) { }
}

export class EndNight {
  static readonly type = `[${nightActionsPrefix}] End night`;
  constructor() { }
}
