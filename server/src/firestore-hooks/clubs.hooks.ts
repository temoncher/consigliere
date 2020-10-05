
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import { CollectionName } from '@/enums/colletion-name.enum';
import { IDocumentMeta } from '@/interfaces/document-meta.interface';

export const clubsOnCreate = functions.firestore
  .document(`/${CollectionName.CLUBS}/{clubId}`)
  .onCreate((clubSnapshot, context) => {
    const meta: IDocumentMeta = {
      createdBy: context.auth.uid,
      updatedBy: context.auth.uid,
      createdAt: context.timestamp,
      updatedAt: context.timestamp,
    };

    return clubSnapshot.ref.set(
      meta,
      { merge: true },
    );
  });

export const clubsOnUpdate = functions.firestore
  .document(`/${CollectionName.CLUBS}/{clubId}`)
  .onUpdate((clubChange, context) => {
    const clubId = clubChange.after.id;
    const clubDoc = admin.firestore().collection(CollectionName.CLUBS).doc(clubId);
    const meta: Partial<IDocumentMeta> = {
      updatedBy: context.auth.uid,
      updatedAt: context.timestamp,
    };

    return clubDoc.set(
      meta,
      { merge: true },
    );
  });
