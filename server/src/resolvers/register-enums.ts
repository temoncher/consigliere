import { registerEnumType } from '@nestjs/graphql';

import { GameResult } from '~/types/game-result.enum';
import { Role } from '~/types/role.enum';
import { RoundPhase } from '~/types/round-phase.enum';
import { VoteResult } from '~/types/vote-result.enum';

export const registerEnums = (): void => {
  registerEnumType(GameResult, { name: 'GameResult' });
  registerEnumType(Role, { name: 'Role' });
  registerEnumType(RoundPhase, { name: 'RoundPhase' });
  registerEnumType(VoteResult, { name: 'VoteResult' });
};
