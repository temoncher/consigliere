/* eslint-disable no-console */
import { ErrorHandler, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  constructor(private errorHandler: ErrorHandler) {}

  log(message: string, ...rest: any[]) {
    if (!environment.production || environment.emulation) {
      console.log(message, ...rest);
    }
  }

  error(error: Error) {
    this.errorHandler.handleError(error);
  }

  warn(message: string, ...rest: any[]) {
    if (!environment.production || environment.emulation) {
      console.warn(message, ...rest);
    }
  }
}
