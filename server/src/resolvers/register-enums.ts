import { registerEnumType } from '@nestjs/graphql';

import { GameResult } from '~types/enums/game-result.enum';
import { Role } from '~types/enums/role.enum';
import { RoundPhase } from '~types/enums/round-phase.enum';
import { VoteResult } from '~types/enums/vote-result.enum';

export const registerEnums = (): void => {
  registerEnumType(GameResult, { name: 'GameResult' });
  registerEnumType(Role, { name: 'Role' });
  registerEnumType(RoundPhase, { name: 'RoundPhase' });
  registerEnumType(VoteResult, { name: 'VoteResult' });
};
