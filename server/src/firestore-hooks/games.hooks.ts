import * as functions from 'firebase-functions';

import { AlgoliaSingleton } from './algolia-singleton';

import { CollectionName } from '~types/enums/colletion-name.enum';

export const createGameByParticipantIndex = functions.firestore.document(`${CollectionName.GAMES}/{gameId}`)
  .onCreate((gameSnapshot) => {
    const gameData = gameSnapshot.data();
    const objectID = gameSnapshot.id;

    return AlgoliaSingleton.client.gamesByParticipantIndex.saveObject({ ...gameData, objectID });
  });

export const updateGameByParticipantIndex = functions.firestore.document(`${CollectionName.GAMES}/{gameId}`)
  .onUpdate(({ after: gameSnapshot }) => {
    const gameData = gameSnapshot.data();
    const objectID = gameSnapshot.id;

    return AlgoliaSingleton.client.gamesByParticipantIndex.saveObject({ ...gameData, objectID });
  });

export const deleteGameByParticipantIndex = functions.firestore.document(`${CollectionName.GAMES}/{gameId}`)
  .onDelete((gameSnapshot) => AlgoliaSingleton.client.gamesByParticipantIndex.deleteObject(gameSnapshot.id));
