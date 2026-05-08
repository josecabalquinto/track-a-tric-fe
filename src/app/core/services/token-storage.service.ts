import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthSession } from '../models/auth.models';

@Injectable({
  providedIn: 'root',
})
export class TokenStorageService {
  private readonly storageKey = `${environment.appVersion}-${environment.USERDATA_KEY}`;

  get session(): AuthSession | null {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as AuthSession;
    } catch {
      localStorage.removeItem(this.storageKey);
      return null;
    }
  }

  set session(value: AuthSession | null) {
    if (!value) {
      localStorage.removeItem(this.storageKey);
      return;
    }

    localStorage.setItem(this.storageKey, JSON.stringify(value));
  }

  clear(): void {
    localStorage.removeItem(this.storageKey);
  }
}
