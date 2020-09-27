import { PlayerControlsAction } from '@/table/models/player-controls-action.enum';

export interface PlayerControlsOptions {
  playerNumber: number;
  action: PlayerControlsAction;
}
