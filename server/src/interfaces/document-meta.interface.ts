import * as admin from 'firebase-admin';

export interface IDocumentMeta {
  createdBy: string;
  updatedBy: string;
  createdAt: admin.firestore.Timestamp;
  updatedAt: admin.firestore.Timestamp;
}
