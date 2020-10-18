import { Injectable, Scope } from '@nestjs/common';
import algoliasearch, { SearchIndex } from 'algoliasearch';
import * as functions from 'firebase-functions';

import { AlgoliaPrefix, AlgoliaIndex } from '@/enums/algolia-index.enum';
import { FunctionsConfig } from '@/interfaces/functions-config.interface';

@Injectable({
  scope: Scope.DEFAULT,
})
export class AlgoliaService {
  clubsIndex: SearchIndex;
  gamesByParticipantIndex: SearchIndex;

  constructor() {
    const config: FunctionsConfig = functions.config() as FunctionsConfig;
    const APP_ID = config.algolia.app;
    const ADMIN_KEY = config.algolia.key;

    const prefix = process.env.FUNCTIONS_EMULATOR ? AlgoliaPrefix.DEVELOPMENT : AlgoliaPrefix.PRODUCTION;
    const algoliaClient = algoliasearch(APP_ID, ADMIN_KEY);

    const clubsIndexName = `${prefix}_${AlgoliaIndex.CLUBS}`;
    const gamesByParticipantIndexName = `${prefix}_${AlgoliaIndex.GAMES_BY_PARTICIPANT}`;

    console.log('Initialized Algolia with prefix:', prefix);
    this.clubsIndex = algoliaClient.initIndex(clubsIndexName);
    this.gamesByParticipantIndex = algoliaClient.initIndex(gamesByParticipantIndexName);
    console.log('Clubs:', clubsIndexName);
    console.log('Games:', gamesByParticipantIndexName);
  }
}
