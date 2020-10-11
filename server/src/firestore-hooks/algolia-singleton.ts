import algoliasearch, { SearchIndex } from 'algoliasearch';
import * as functions from 'firebase-functions';

import { AlgoliaIndex, AlgoliaPrefix } from '@/enums/algolia-index.enum';
import { FunctionsConfig } from '@/interfaces/functions-config.interface';

export class AlgoliaSingleton {
  private static instance: AlgoliaSingleton;
  clubsIndex: SearchIndex;

  static get client(): AlgoliaSingleton {
    if (!AlgoliaSingleton.instance) {
      return new AlgoliaSingleton();
    }

    return AlgoliaSingleton.instance;
  }

  private constructor() {
    const config: FunctionsConfig = functions.config() as FunctionsConfig;
    const APP_ID = config.algolia.app;
    const ADMIN_KEY = config.algolia.key;
    const algoliaClient = algoliasearch(APP_ID, ADMIN_KEY);

    const prefix = process.env.FUNCTIONS_EMULATOR ? AlgoliaPrefix.DEVELOPMENT : AlgoliaPrefix.PRODUCTION;
    const clubsIndexName = `${prefix}_${AlgoliaIndex.CLUBS}`;

    console.log('Initialized Algolia');
    this.clubsIndex = algoliaClient.initIndex(clubsIndexName);
    console.log('Clubs:', clubsIndexName);
  }
}
