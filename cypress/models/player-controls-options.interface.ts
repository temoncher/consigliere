import { PlayerControlsAction } from '@shared/models/table/player-controls-action.enum';

export interface PlayerControlsOptions {
  playerNumber: number;
  action: PlayerControlsAction;
}
