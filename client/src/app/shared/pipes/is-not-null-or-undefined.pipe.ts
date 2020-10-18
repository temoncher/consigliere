import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

const inputIsNotNullOrUndefined = <T>(input: null | undefined | T): input is T => input !== null && input !== undefined;

export const isNotNullOrUndefined = <T>() => (source$: Observable<null | undefined | T>) => source$.pipe(
  filter(inputIsNotNullOrUndefined),
);
