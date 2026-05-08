import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { SharedUiModule } from 'src/app/shared/shared-ui.module';
import { DashboardService } from './dashboard.service';
import { DriversService } from '../drivers/services/drivers.service';
import { TripsService } from '../trips/trips.service';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    SharedUiModule,
    RouterModule.forChild([
      {
        path: '',
        component: DashboardComponent,
      },
    ]),
  ],
  providers: [DashboardService, TripsService, DriversService],
})
export class DashboardModule {}
