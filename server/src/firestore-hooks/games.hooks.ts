
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import { CollectionName } from '@/enums/colletion-name.enum';

export const gamesCreatedAt = functions.firestore
  .document(`/${CollectionName.GAMES}/{gameId}`)
  .onCreate((gameSnapshot) => {
    // TODO: implement timestamp correctly
    const now = admin.firestore.Timestamp.now().toDate().toISOString();

    return gameSnapshot.ref.set(
      {
        createdAt: now,
        updatedAt: now,
      },
      { merge: true },
    );
  });
