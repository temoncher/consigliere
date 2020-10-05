
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import { CollectionName } from '@/enums/colletion-name.enum';
import { IDocumentMeta } from '@/interfaces/document-meta.interface';

export const usersCreatedAt = functions.firestore
  .document(`/${CollectionName.USERS}/{userId}`)
  .onCreate((userSnapshot, context) => {
    const meta: IDocumentMeta = {
      createdBy: context.auth.uid,
      updatedBy: context.auth.uid,
      createdAt: context.timestamp,
      updatedAt: context.timestamp,
    };

    return userSnapshot.ref.set(
      meta,
      { merge: true },
    );
  });

export const usersOnUpdate = functions.firestore
  .document(`/${CollectionName.USERS}/{userId}`)
  .onUpdate((userChange, context) => {
    const userId = userChange.after.id;
    const userDoc = admin.firestore().collection(CollectionName.USERS).doc(userId);
    const meta: Partial<IDocumentMeta> = {
      updatedBy: context.auth.uid,
      updatedAt: context.timestamp,
    };

    return userDoc.set(
      meta,
      { merge: true },
    );
  });
