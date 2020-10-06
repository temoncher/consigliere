import * as admin from 'firebase-admin';

export interface IGQLContext {
  headers?: {
    authorization?: string;
  };
  user: admin.auth.UserRecord;
}
