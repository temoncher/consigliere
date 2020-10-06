import { Field, ID, ObjectType } from '@nestjs/graphql';
import * as admin from 'firebase-admin';

import { FirebaseTimestampScalar } from '@/scalars/firebase-timestamp.scalar';

@ObjectType()
export class DocumentMeta {
  @Field(() => ID)
  createdBy: string;
  @Field(() => ID)
  updatedBy: string;
  @Field(() => FirebaseTimestampScalar)
  createdAt: admin.firestore.Timestamp;
  @Field(() => FirebaseTimestampScalar)
  updatedAt: admin.firestore.Timestamp;
}
