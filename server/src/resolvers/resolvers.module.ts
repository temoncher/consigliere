import { Module } from '@nestjs/common';

import { GamesResolver } from './games/games.resolver';
import { UsersResolver } from './users/users.resolver';

@Module({
  providers: [
    UsersResolver,
    GamesResolver,
  ],
})
export class ResolversModule {}
