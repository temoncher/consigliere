import { Day } from '@shared/models/day.model';

export class AddDay {
  static readonly type = '[Table] Add day';
  constructor(public day: Day) { }
}
