import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RoleGuard } from 'src/app/core/guards/role.guard';
import { SharedUiModule } from 'src/app/shared/shared-ui.module';
import { DriverDetailComponent } from './components/driver-detail/driver-detail.component';
import { DriverFormComponent } from './components/driver-form/driver-form.component';
import { DriversListComponent } from './components/drivers-list/drivers-list.component';
import { DriversService } from './services/drivers.service';

@NgModule({
  declarations: [DriversListComponent, DriverDetailComponent, DriverFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedUiModule,
    RouterModule.forChild([
      { path: '', component: DriversListComponent },
      { path: 'new', component: DriverFormComponent, canActivate: [RoleGuard], data: { roles: ['superadmin'] } },
      { path: ':id/edit', component: DriverFormComponent, canActivate: [RoleGuard], data: { roles: ['superadmin'] } },
      { path: ':id', component: DriverDetailComponent },
    ]),
  ],
  providers: [DriversService],
})
export class DriversModule {}
