import { SearchIndex } from 'algoliasearch';

import { bootAlgolia } from '@/helpers/boot-algolia';

export class AlgoliaSingleton {
  private static instance: AlgoliaSingleton;
  clubsIndex: SearchIndex;
  gamesByParticipantIndex: SearchIndex;

  static get client(): AlgoliaSingleton {
    if (!AlgoliaSingleton.instance) {
      return new AlgoliaSingleton();
    }

    return AlgoliaSingleton.instance;
  }

  private constructor() {
    const indecies = bootAlgolia();

    this.clubsIndex = indecies.clubsIndex;
    this.gamesByParticipantIndex = indecies.gamesByParticipantIndex;
  }
}
