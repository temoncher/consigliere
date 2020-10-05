
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import { CollectionName } from '@/enums/colletion-name.enum';
import { IDocumentMeta } from '@/interfaces/document-meta.interface';

export const gamesOnCreate = functions.firestore
  .document(`/${CollectionName.GAMES}/{gameId}`)
  .onCreate((gameSnapshot, context) => {
    // TODO: implement timestamp correctly
    const meta: IDocumentMeta = {
      createdBy: context.auth.uid,
      updatedBy: context.auth.uid,
      createdAt: context.timestamp,
      updatedAt: context.timestamp,
    };

    return gameSnapshot.ref.set(
      meta,
      { merge: true },
    );
  });

export const gamesOnUpdate = functions.firestore
  .document(`/${CollectionName.GAMES}/{gameId}`)
  .onUpdate((gameChange, context) => {
    const gameId = gameChange.after.id;
    const gameDoc = admin.firestore().collection(CollectionName.GAMES).doc(gameId);
    const meta: Partial<IDocumentMeta> = {
      updatedBy: context.auth.uid,
      updatedAt: context.timestamp,
    };

    return gameDoc.set(
      meta,
      { merge: true },
    );
  });
