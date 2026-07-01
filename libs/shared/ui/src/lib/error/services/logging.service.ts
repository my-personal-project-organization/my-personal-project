import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoggingService {
  /**
   * The logError function takes two parameters, a message and a stack, and logs them to the console
   * @param {string} message - The error message
   * @param {string} stack - The stack trace of the error
   * @param {Error | HttpErrorResponse} error - The `error` parameter is of type `Error |
   * HttpErrorResponse`. This means it can accept either an `Error` object or an `HttpErrorResponse`
   * object.
   */
  logError(message: string, stack: string, error: Error | HttpErrorResponse) {
    this.logErrorLocally(message, stack);
  }

  /**
   * It logs the error message, stack trace, and state to the console
   * @param {string} message - The error message.
   * @param {string} stack - The stack trace of the error.
   */
  private logErrorLocally(message: string, stack: string) {
    console.error(`LoggingService: MESSAGE: ${message}  * STACK: ${stack}`);
  }
}
