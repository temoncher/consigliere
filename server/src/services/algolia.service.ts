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

  constructor() {
    const config: FunctionsConfig = functions.config() as FunctionsConfig;
    const APP_ID = config.algolia.app;
    const ADMIN_KEY = config.algolia.key;

    const prefix = process.env.FUNCTIONS_EMULATOR ? AlgoliaPrefix.DEVELOPMENT : AlgoliaPrefix.PRODUCTION;
    const algoliaClient = algoliasearch(APP_ID, ADMIN_KEY);

    this.clubsIndex = algoliaClient.initIndex(`${prefix}_${AlgoliaIndex.CLUBS}`);
  }
}
