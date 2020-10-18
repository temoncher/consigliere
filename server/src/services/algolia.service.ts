import { Injectable, Scope } from '@nestjs/common';
import { SearchIndex } from 'algoliasearch';

import { bootAlgolia } from '@/helpers/boot-algolia';

@Injectable({
  scope: Scope.DEFAULT,
})
export class AlgoliaService {
  clubsIndex: SearchIndex;
  gamesByParticipantIndex: SearchIndex;

  constructor() {
    const indecies = bootAlgolia();

    this.clubsIndex = indecies.clubsIndex;
    this.gamesByParticipantIndex = indecies.gamesByParticipantIndex;
  }
}
