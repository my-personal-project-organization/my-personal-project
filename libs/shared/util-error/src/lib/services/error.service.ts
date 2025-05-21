import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { errorTranslations } from '../translations/error-translations';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  // * PUBLIC Functions
  /**
   * If the user is offline, return a message saying so, otherwise return the error message
   * @param {Error} error - Error - The error object that was thrown.
   * @returns The error message.
   */
  getClientMessage(error: Error): any {
    const errorMessage = {
      text: '',
      severity: 'error',
    };
    errorMessage.text = error.message ? `${error.message}` : `${error.toString()}`;
    return errorMessage;
  }

  /**
   * It returns the stack trace of the error object passed to it
   * @param {Error} error - Error - The error object that was thrown.
   * @returns The stack trace of the error.
   */
  getClientStack(error: Error): string {
    return error.stack as string;
  }

  /**
   * It returns the error message from the server
   * @param {HttpErrorResponse} error - HttpErrorResponse - The error object that was returned from
   * the server.
   * @returns The error message from the server.
   */
  getServerMessage(error: HttpErrorResponse): any {
    const errorMessage = {
      text: '',
      severity: 'error',
    };
    let endpoint = '';
    let errors = {};
    if (error.status === 500) {
      errorMessage.text = `${errorMessage.text ? errorMessage.text : ''}`;
      return errorMessage;
    } else if (error.status === 0) {
      errorMessage.text = `Network error: Status code '0' can occur because of three reasons:
            1) The Client cannot connect to the server.
            2) The Client cannot receive the response within the timeout period.
            3) The Request was "stopped(aborted)" by the Client.`;
    }
    if (error.url && error.url.split('/')[4]) {
      endpoint = `/${error.url.split('/')[4]}`;
      endpoint = endpoint.split('?')[0];
    }
    if (endpoint in errorTranslations) {
      errors = errorTranslations[endpoint as keyof typeof errorTranslations];
    }
    if (error.status.toString() in errors) {
      errorMessage.text = `${errorMessage.text ? errorMessage.text : ''}`;
      return errorMessage;
    }
    errorMessage.text = `${errorMessage.text ? errorMessage.text : ''} ${error.message}`;
    return errorMessage;
  }

  /**
   * It returns the stack trace of the error if the error is an instance of HttpErrorResponse
   * @param {HttpErrorResponse} error - HttpErrorResponse - the error object that was thrown by the
   * server
   * @returns The stack trace of the error.
   */
  getServerStack(error: HttpErrorResponse): string {
    let stackMessage: string;
    if (error.error) {
      stackMessage = `${error.status}: ${JSON.stringify(error.error)}`;
    } else {
      stackMessage = `${error.status}: ${JSON.stringify(error)}`;
    }
    return stackMessage;
  }
}
