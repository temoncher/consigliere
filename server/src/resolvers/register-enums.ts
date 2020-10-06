import { registerEnumType } from '@nestjs/graphql';

import { GameResult } from '~enums/game-result.enum';
import { Role } from '~enums/role.enum';
import { RoundPhase } from '~enums/round-phase.enum';
import { VoteResult } from '~enums/vote-result.enum';

export const registerEnums = (): void => {
  registerEnumType(GameResult, { name: 'GameResult' });
  registerEnumType(Role, { name: 'Role' });
  registerEnumType(RoundPhase, { name: 'RoundPhase' });
  registerEnumType(VoteResult, { name: 'VoteResult' });
};
