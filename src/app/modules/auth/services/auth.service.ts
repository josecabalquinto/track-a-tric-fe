import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { catchError, finalize, map, tap } from 'rxjs/operators';
import { UserModel } from '../models/user.model';
import { AuthModel } from '../models/auth.model';
import { AuthHTTPService } from './auth-http';
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { AdminRole } from 'src/app/core/models/auth.models';

export type UserType = UserModel | undefined;

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private unsubscribe: Subscription[] = [];

  currentUser$: Observable<UserType>;
  isLoading$: Observable<boolean>;
  currentUserSubject: BehaviorSubject<UserType>;
  isLoadingSubject: BehaviorSubject<boolean>;

  get currentUserValue(): UserType {
    return this.currentUserSubject.value;
  }

  set currentUserValue(user: UserType) {
    this.currentUserSubject.next(user);
  }

  constructor(
    private authHttpService: AuthHTTPService,
    private router: Router,
    private tokenStorage: TokenStorageService
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.currentUserSubject = new BehaviorSubject<UserType>(undefined);
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.isLoading$ = this.isLoadingSubject.asObservable();
    this.restoreSession();
  }

  login(email: string, password: string): Observable<UserType> {
    this.isLoadingSubject.next(true);
    return this.authHttpService.login(email, password).pipe(
      map((response) => this.authHttpService.mapSession(response.data)),
      tap((session) => this.setAuthFromLocalStorage(session)),
      map((session) => {
        this.currentUserSubject.next(session.admin);
        return session.admin;
      }),
      catchError((err) => {
        console.error('login error', err);
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  logout(): void {
    const request = this.authHttpService.logout().pipe(
      catchError(() => of(null)),
      finalize(() => {
        this.clearSession();
        this.router.navigate(['/auth/login']);
      })
    ).subscribe();

    this.unsubscribe.push(request);
  }

  getUserByToken(): Observable<UserType> {
    const session = this.tokenStorage.session;
    if (!session?.token) {
      return of(undefined);
    }

    this.currentUserSubject.next(session.admin);
    return of(session.admin);
  }

  restoreSession(): void {
    const session = this.tokenStorage.session;
    if (session?.token) {
      this.currentUserSubject.next(session.admin);
    }
  }

  hasRole(role: AdminRole): boolean {
    return this.currentUserValue?.role === role;
  }

  private setAuthFromLocalStorage(auth: AuthModel): boolean {
    if (auth?.token) {
      this.tokenStorage.session = auth;
      return true;
    }
    return false;
  }

  private clearSession(): void {
    this.tokenStorage.clear();
    this.currentUserSubject.next(undefined);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
