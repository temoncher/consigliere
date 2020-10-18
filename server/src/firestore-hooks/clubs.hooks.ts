import * as functions from 'firebase-functions';

import { AlgoliaSingleton } from './algolia-singleton';

import { CollectionName } from '~types/enums/colletion-name.enum';

export const createClubIndex = functions.firestore.document(`${CollectionName.CLUBS}/{clubId}`)
  .onCreate((clubSnapshot) => {
    const clubData = clubSnapshot.data();
    const objectID = clubSnapshot.id;

    return AlgoliaSingleton.client.clubsIndex.saveObject({ ...clubData, objectID });
  });

export const updateClubIndex = functions.firestore.document(`${CollectionName.CLUBS}/{clubId}`)
  .onUpdate(({ after: clubSnapshot }) => {
    const clubData = clubSnapshot.data();
    const objectID = clubSnapshot.id;

    return AlgoliaSingleton.client.clubsIndex.saveObject({ ...clubData, objectID });
  });

export const deleteClubIndex = functions.firestore.document(`${CollectionName.CLUBS}/{clubId}`)
  .onDelete((clubSnapshot) => AlgoliaSingleton.client.clubsIndex.deleteObject(clubSnapshot.id));
