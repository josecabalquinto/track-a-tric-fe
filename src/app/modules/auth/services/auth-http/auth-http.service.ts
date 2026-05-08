import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { AuthModel } from '../../models/auth.model';
import { ApiSuccessResponse } from 'src/app/core/models/api.models';
import { AdminProfile } from 'src/app/core/models/auth.models';

const API_AUTH_URL = `${environment.apiUrl}/admin`;

@Injectable({
  providedIn: 'root',
})
export class AuthHTTPService {
  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<ApiSuccessResponse<AuthModel>> {
    return this.http.post<ApiSuccessResponse<AuthModel>>(`${API_AUTH_URL}/login`, {
      email,
      password,
    });
  }

  logout(): Observable<ApiSuccessResponse<null>> {
    return this.http.post<ApiSuccessResponse<null>>(`${API_AUTH_URL}/logout`, {});
  }

  mapSession(payload: unknown): AuthModel {
    const response = payload as Record<string, unknown>;
    const adminSource = (response['admin'] ?? response['user'] ?? response['data']) as Record<string, unknown> | undefined;
    const role = String(adminSource?.['role'] ?? response['role'] ?? 'officer') as AdminProfile['role'];

    return {
      token: String(response['token'] ?? response['access_token'] ?? response['authToken'] ?? ''),
      admin: {
        id: Number(adminSource?.['id'] ?? 0),
        name: String(adminSource?.['name'] ?? adminSource?.['fullname'] ?? 'Unknown Admin'),
        email: String(adminSource?.['email'] ?? ''),
        role,
        firstname: String(adminSource?.['firstname'] ?? adminSource?.['first_name'] ?? adminSource?.['name'] ?? ''),
        lastname: String(adminSource?.['lastname'] ?? adminSource?.['last_name'] ?? ''),
        pic: String(adminSource?.['pic'] ?? './assets/media/avatars/blank.png'),
        last_login_at: (adminSource?.['last_login_at'] as string | null | undefined) ?? null,
      },
    };
  }
}
