import { CurrentDayState, CurrentDayStateModel } from './current-day/current-day.state';
import { CurrentNightState, CurrentNightStateModel } from './current-night/current-night.state';
import { CurrentVoteState, CurrentVoteStateModel } from './current-vote/current-vote.state';
import { RoundStateModel, RoundState } from './round.state';

export interface ExtendedRoundStateModel extends RoundStateModel {
  currentNight: CurrentNightStateModel;
  currentDay: CurrentDayStateModel;
  currentVote: CurrentVoteStateModel;
}

export const RoundStates = [
  RoundState,
  CurrentNightState,
  CurrentDayState,
  CurrentVoteState,
];
