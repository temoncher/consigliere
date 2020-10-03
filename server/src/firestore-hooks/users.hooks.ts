
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import { CollectionName } from '@/enums/colletion-name.enum';

export const usersCreatedAt = functions.firestore
  .document(`/${CollectionName.USERS}/{userId}`)
  .onCreate((userSnapshot) => {
    // TODO: implement timestamp correctly
    const now = admin.firestore.Timestamp.now();

    return userSnapshot.ref.set(
      {
        createdAt: now,
        updatedAt: now,
      },
      { merge: true },
    );
  });
