import { registerEnumType } from '@nestjs/graphql';

export enum GameResult {
  MAFIA = 'MAFIA',
  CIVILIANS = 'CIVILIANS',
  TIE = 'TIE'
}

registerEnumType(GameResult, {
  name: 'GameResult',
});
