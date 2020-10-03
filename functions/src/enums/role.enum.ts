import { registerEnumType } from '@nestjs/graphql';

export enum Role {
  MAFIA = 'MAFIA',
  CITIZEN = 'CITIZEN',
  DON = 'DON',
  SHERIFF = 'SHERIFF',
  HOST = 'HOST',
  CREATOR = 'CREATOR'
}

registerEnumType(Role, {
  name: 'Role',
});
