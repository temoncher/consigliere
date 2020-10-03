import { PlayerControlsAction } from '@/table/models/player-controls-action.enum';

export interface IPlayerControlsOptions {
  playerNumber: number;
  action: PlayerControlsAction;
}
