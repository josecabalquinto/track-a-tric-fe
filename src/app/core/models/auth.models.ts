export type AdminRole = 'officer' | 'superadmin';

export interface AdminProfile {
  id: number;
  name: string;
  email: string;
  role: AdminRole;
  firstname?: string;
  lastname?: string;
  pic?: string;
  last_login_at?: string | null;
}

export interface AuthSession {
  token: string;
  admin: AdminProfile;
}

export interface LoginPayload {
  email: string;
  password: string;
}
