import { registerEnumType } from '@nestjs/graphql';

export enum RoundPhase {
  DAY = 'DAY',
  NIGHT = 'NIGHT',
  VOTE = 'VOTE'
}

registerEnumType(RoundPhase, {
  name: 'RoundPhase',
});
