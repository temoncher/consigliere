
import { Scalar, CustomScalar } from '@nestjs/graphql';
import * as admin from 'firebase-admin';
import { ValueNode, Kind } from 'graphql';

@Scalar('FirebaseTimestamp')
export class FirebaseTimestampScalar implements CustomScalar<number, admin.firestore.Timestamp> {
  description = 'Firebase timestamp';

  parseValue(milliseconds: number): admin.firestore.Timestamp {
    return admin.firestore.Timestamp.fromMillis(milliseconds); // value from the client
  }

  serialize(timestamp: { _seconds: number; _nanoseconds: number }): number {
    return new admin.firestore.Timestamp(
      /* eslint-disable no-underscore-dangle */
      timestamp._seconds,
      timestamp._nanoseconds,
      /* eslint-enable */
    ).toMillis(); // value sent to the client
  }

  parseLiteral(ast: ValueNode): admin.firestore.Timestamp | null {
    if (ast.kind === Kind.INT) {
      return admin.firestore.Timestamp.fromMillis(Number(ast.value));
    }

    return null;
  }
}
