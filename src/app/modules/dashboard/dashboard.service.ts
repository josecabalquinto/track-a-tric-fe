import { Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
import { TripFlag } from 'src/app/core/models/flag.models';
import { DashboardVm } from './dashboard.models';
import { DriversService } from '../drivers/services/drivers.service';
import { TripsService } from '../trips/trips.service';

@Injectable()
export class DashboardService {
  constructor(private tripsService: TripsService, private driversService: DriversService) {}

  loadOverview(): Observable<DashboardVm> {
    return forkJoin({
      trips: this.tripsService.getTrips({ per_page: 10, page: 1 }),
      drivers: this.driversService.getDrivers({ per_page: 10, page: 1 }),
    }).pipe(
      map(({ trips, drivers }) => {
        const recentTrips = trips.items;
        const recentDrivers = drivers.items;
        const allFlags = recentTrips.reduce<TripFlag[]>((accumulator, trip) => {
          return accumulator.concat(trip.flags ?? []);
        }, []);
        const activeTrips = recentTrips.filter((trip) => trip.status === 'active').length;
        const completedToday = recentTrips.filter((trip) => trip.status === 'completed').length;
        const flaggedTrips = recentTrips.filter((trip) => (trip.flags?.length ?? 0) > 0).length;
        const approvedDrivers = recentDrivers.filter((driver) => driver.status === 'approved').length;
        const pendingDrivers = recentDrivers.filter((driver) => driver.status === 'pending').length;
        const suspendedDrivers = recentDrivers.filter((driver) => driver.status === 'suspended').length;

        return {
          activeTrips,
          completedToday,
          flaggedTrips,
          totalDrivers: drivers.meta.total,
          approvedDrivers,
          pendingDrivers,
          suspendedDrivers,
          openFlags: allFlags.filter((flag: TripFlag) => flag.status === 'open').length,
          resolvedFlags: allFlags.filter((flag: TripFlag) => flag.status === 'resolved').length,
          recentTrips,
          recentDrivers,
        };
      })
    );
  }
}
