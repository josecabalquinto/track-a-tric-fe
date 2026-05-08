import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  extractMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
    if (error instanceof HttpErrorResponse) {
      const body = error.error;
      if (typeof body?.message === 'string' && body.message.trim()) {
        return body.message;
      }

      if (typeof body?.error === 'string' && body.error.trim()) {
        return body.error;
      }

      if (error.status === 0) {
        return 'Unable to reach the server. Check the API connection and try again.';
      }
    }

    return fallback;
  }

  toObservable(error: unknown): Observable<never> {
    return throwError(() => new Error(this.extractMessage(error)));
  }
}
