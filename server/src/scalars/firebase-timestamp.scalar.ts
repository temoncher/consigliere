import { Scalar, CustomScalar } from '@nestjs/graphql';
import * as admin from 'firebase-admin';
import { ValueNode, Kind } from 'graphql';

@Scalar('FirebaseTimestamp')
export class FirebaseTimestampScalar implements CustomScalar<number, admin.firestore.Timestamp> {
  description = 'Firebase timestamp';

  parseValue(milliseconds: number): admin.firestore.Timestamp {
    return admin.firestore.Timestamp.fromMillis(milliseconds); // value from the client
  }

  serialize(timestamp: admin.firestore.Timestamp): number {
    return timestamp.toMillis(); // value sent to the client
  }

  parseLiteral(ast: ValueNode): admin.firestore.Timestamp {
    if (ast.kind === Kind.INT) {
      return admin.firestore.Timestamp.fromMillis(Number(ast.value));
    }

    return null;
  }
}
