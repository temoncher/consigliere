import { Module } from '@nestjs/common';

import { FirebaseTimestampScalar } from '@/scalars/firebase-timestamp.scalar';

import { ClubsResolver } from './clubs/clubs.resolver';
import { GamesResolver } from './games/games.resolver';
import { JoinRequestsResolver } from './join-requests/join-requests.resolver';
import { registerEnums } from './register-enums';
import { UsersResolver } from './users/users.resolver';

registerEnums();

@Module({
  providers: [
    ClubsResolver,
    GamesResolver,
    UsersResolver,
    JoinRequestsResolver,
    FirebaseTimestampScalar,
  ],
})
export class ResolversModule {}
