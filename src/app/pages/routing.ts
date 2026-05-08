import { Routes } from '@angular/router';
import { RoleGuard } from '../core/guards/role.guard';

const Routing: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'trips',
    loadChildren: () => import('./trips/trips.module').then((m) => m.TripsModule),
  },
  {
    path: 'drivers',
    loadChildren: () => import('./drivers/drivers.module').then((m) => m.DriversModule),
  },
  {
    path: 'citywall',
    canActivate: [RoleGuard],
    data: { roles: ['superadmin'] },
    loadChildren: () => import('./citywall/citywall.module').then((m) => m.CitywallModule),
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'error/404',
  },
];

export { Routing };
