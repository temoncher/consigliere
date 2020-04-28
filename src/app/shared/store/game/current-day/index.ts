import { CurrentDayStateModel, CurrentDayState } from './current-day.state';
import { CurrentVoteStateModel, CurrentVoteState } from './current-vote/current-vote.state';

export interface ExtendedCurrentDayStateModel extends CurrentDayStateModel {
  currentVote: CurrentVoteStateModel;
}

export const CurrentDayStates = [
  CurrentDayState,
  CurrentVoteState,
];
