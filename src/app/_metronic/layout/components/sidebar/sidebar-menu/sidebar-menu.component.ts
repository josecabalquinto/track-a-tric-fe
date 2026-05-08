import { Component } from '@angular/core';
import { AuthService } from 'src/app/modules/auth/services/auth.service';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss'],
  standalone: false
})
export class SidebarMenuComponent {
  constructor(public authService: AuthService) {}

  get isSuperadmin(): boolean {
    return this.authService.currentUserValue?.role === 'superadmin';
  }
}
