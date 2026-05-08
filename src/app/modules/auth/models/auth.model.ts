import { AuthSession } from 'src/app/core/models/auth.models';

export class AuthModel implements AuthSession {
  token: string;
  admin: AuthSession['admin'];
}
