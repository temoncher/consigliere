import { Module } from '@nestjs/common';

import { ClubsResolver } from './clubs/clubs.resolver';
import { GamesResolver } from './games/games.resolver';
import { UsersResolver } from './users/users.resolver';

@Module({
  providers: [
    ClubsResolver,
    GamesResolver,
    UsersResolver,
  ],
})
export class ResolversModule {}
