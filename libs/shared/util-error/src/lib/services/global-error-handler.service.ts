import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, inject, Injectable, Injector } from '@angular/core';

import { ErrorService } from './error.service';
import { LoggingService } from './logging.service';
import { ToastService } from '@mpp/shared/ui';

@Injectable({
  providedIn: 'root',
})
export class GlobalErrorHandlerService implements ErrorHandler {
  // Error handling is important and needs to be loaded first.
  // Because of this we should manually inject the services with Injector.
  private injector = inject(Injector);
  private toastService = inject(ToastService);

  /**
   * If the error is a server error, then show the error message returned from the server. If the
   * error is a client error, then show the error message returned from the client
   * @param {Error | HttpErrorResponse} error - The error object that was thrown.
   */
  handleError(error: Error | HttpErrorResponse) {
    const errorService = this.injector.get(ErrorService);
    const loggingService = this.injector.get(LoggingService);

    let message;
    let stackTrace;
    let text = '';

    if (error instanceof HttpErrorResponse) {
      // Server Error
      message = errorService.getServerMessage(error);
      stackTrace = errorService.getServerStack(error);
      // We hide the Server errors that we don't want to notify the user.
      // Example: from error-translations.ts => PASSWORD_EXPIRED: undefined
      if (message.text !== '') {
        this.toastService.error(message.text, message.severity);
      }
      text = `Server error: ${message.text}`;
    } else {
      // Client Error
      message = errorService.getClientMessage(error);
      stackTrace = errorService.getClientStack(error);
      this.toastService.error(message.text, message.severity);
      text = `Client error: ${message.text}`;
    }

    // Always log errors
    loggingService.logError(text, stackTrace, error);
  }
}
