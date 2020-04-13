import { Daytime } from './daytime.model';
import { Nighttime } from './nighttime.model';

export class Day {
  nighttime: Nighttime;
  daytime: Daytime;

  constructor() {
    this.nighttime = new Nighttime();
    this.daytime = new Daytime();
  }
}
