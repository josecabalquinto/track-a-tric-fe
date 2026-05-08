import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenStorageService } from '../services/token-storage.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private tokenStorage: TokenStorageService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const session = this.tokenStorage.session;

    if (!session?.token || this.isPublicSessionRoute(req.url)) {
      return next.handle(req);
    }

    return next.handle(
      req.clone({
        setHeaders: {
          Authorization: `Bearer ${session.token}`,
        },
      })
    );
  }

  private isPublicSessionRoute(url: string): boolean {
    return /\/trips\/\d+\/(pings|end)$/.test(url);
  }
}
