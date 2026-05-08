import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedUiModule } from 'src/app/shared/shared-ui.module';
import { DriverDetailComponent } from './driver-detail.component';
import { DriversListComponent } from './drivers-list.component';
import { DriversService } from './drivers.service';

@NgModule({
  declarations: [DriversListComponent, DriverDetailComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedUiModule,
    RouterModule.forChild([
      { path: '', component: DriversListComponent },
      { path: ':id', component: DriverDetailComponent },
    ]),
  ],
  providers: [DriversService],
})
export class DriversModule {}
