import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import { IFireStoreDocumentMeta } from '@/interfaces/document-meta.interface';

import { CollectionName } from '~types/enums/colletion-name.enum';

export const usersCreatedAt = functions.firestore
  .document(`/${CollectionName.USERS}/{userId}`)
  .onCreate((userSnapshot, context) => {
    if (!context.auth) throw new Error('Unauthorized');

    const meta: IFireStoreDocumentMeta = {
      createdBy: context.auth.uid,
      updatedBy: context.auth.uid,
      createdAt: admin.firestore.Timestamp.now(),
      updatedAt: admin.firestore.Timestamp.now(),
    };

    return userSnapshot.ref.set(
      meta,
      { merge: true },
    );
  });

export const usersOnUpdate = functions.firestore
  .document(`/${CollectionName.USERS}/{userId}`)
  .onUpdate((userChange, context) => {
    if (!context.auth) throw new Error('Unauthorized');

    const userId = userChange.after.id;
    const userDoc = admin.firestore().collection(CollectionName.USERS).doc(userId);
    const meta: Partial<IFireStoreDocumentMeta> = {
      updatedBy: context.auth.uid,
      updatedAt: admin.firestore.Timestamp.now(),
    };

    return userDoc.set(
      meta,
      { merge: true },
    );
  });
