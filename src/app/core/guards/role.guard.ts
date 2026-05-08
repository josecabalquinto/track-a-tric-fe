import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { AdminRole } from '../models/auth.models';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): boolean {
    const expectedRoles = (route.data['roles'] ?? []) as AdminRole[];
    const user = this.authService.currentUserValue;

    if (user && expectedRoles.includes(user.role)) {
      return true;
    }

    this.router.navigate(['/dashboard']);
    return false;
  }
}
