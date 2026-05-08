import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedUiModule } from 'src/app/shared/shared-ui.module';
import { FlagsModule } from '../flags/flags.module';
import { TripDetailComponent } from './trip-detail.component';
import { TripRouteMapComponent } from './trip-route-map/trip-route-map.component';
import { TripsListComponent } from './trips-list.component';
import { TripsService } from './trips.service';

@NgModule({
  declarations: [TripsListComponent, TripDetailComponent, TripRouteMapComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedUiModule,
    FlagsModule,
    NgbModalModule,
    RouterModule.forChild([
      { path: '', component: TripsListComponent },
      { path: ':id', component: TripDetailComponent },
    ]),
  ],
  providers: [TripsService],
})
export class TripsModule {}
