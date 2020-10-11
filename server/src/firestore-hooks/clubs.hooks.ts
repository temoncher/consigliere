import * as functions from 'firebase-functions';

import { AlgoliaSingleton } from './algolia-singleton';

export const createClubIndex = functions.firestore.document('clubs/{clubId}')
  .onCreate((clubSnapshot) => {
    console.log('CREATED');
    const clubData = clubSnapshot.data();
    const objectID = clubSnapshot.id;

    return AlgoliaSingleton.client.clubsIndex.saveObject({ ...clubData, objectID });
  });

export const updateClubIndex = functions.firestore.document('clubs/{clubId}')
  .onUpdate(({ after: clubSnapshot }) => {
    const clubData = clubSnapshot.data();
    const objectID = clubSnapshot.id;

    return AlgoliaSingleton.client.clubsIndex.saveObject({ ...clubData, objectID });
  });

export const deleteClubIndex = functions.firestore.document('clubs/{clubId}')
  .onDelete((clubSnapshot) => AlgoliaSingleton.client.clubsIndex.deleteObject(clubSnapshot.id));
