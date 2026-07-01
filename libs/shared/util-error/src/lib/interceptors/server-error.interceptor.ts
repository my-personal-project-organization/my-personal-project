import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { ErrorHandler, inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export const serverErrorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const errorHandler = inject(ErrorHandler);

  return next(req).pipe(
    tap(() => console.log('Server Error Interceptor')),

    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // refresh token
      } else if (error.status === 403) {
        // Not Authorize
        console.error('You are not Authorize');
      }
      errorHandler.handleError(error);
      return throwError(() => error);
    }),
  );
};
