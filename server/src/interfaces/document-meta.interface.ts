import * as admin from 'firebase-admin';

export interface IFireStoreDocumentMeta {
  createdBy: string;
  updatedBy: string;
  createdAt: admin.firestore.Timestamp;
  updatedAt: admin.firestore.Timestamp;
}
