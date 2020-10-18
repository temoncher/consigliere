import algoliasearch, { SearchIndex } from 'algoliasearch';
import * as functions from 'firebase-functions';

import { AlgoliaPrefix, AlgoliaIndex } from '@/enums/algolia-index.enum';
import { FunctionsConfig } from '@/interfaces/functions-config.interface';

export interface AlgoliaIndecies {
  clubsIndex: SearchIndex;
  gamesByParticipantIndex: SearchIndex;
}

export const bootAlgolia = (): AlgoliaIndecies => {
  const isProduction = process.env.GCLOUD_PROJECT === 'mafia-consigliere';
  const config: FunctionsConfig = functions.config() as FunctionsConfig;
  const APP_ID = config.algolia.app;
  const ADMIN_KEY = config.algolia.key;
  const algoliaClient = algoliasearch(APP_ID, ADMIN_KEY);

  const prefix = isProduction ? AlgoliaPrefix.PRODUCTION : AlgoliaPrefix.DEVELOPMENT;
  const clubsIndexName = `${prefix}_${AlgoliaIndex.CLUBS}`;
  const gamesByParticipantIndexName = `${prefix}_${AlgoliaIndex.GAMES_BY_PARTICIPANT}`;

  console.log('Algolia prefix:', prefix);
  console.log('Clubs:', clubsIndexName);
  console.log('Games:', gamesByParticipantIndexName);
  const indecies: AlgoliaIndecies = {
    clubsIndex: algoliaClient.initIndex(clubsIndexName),
    gamesByParticipantIndex: algoliaClient.initIndex(gamesByParticipantIndexName),
  };

  return indecies;
};
