import { Module } from '@nestjs/common';

import { GamesResolver } from './games.resolver';
import { UsersResolver } from './users.resolver';

@Module({
  providers: [
    UsersResolver,
    GamesResolver,
  ],
})
export class ResolversModule {}
