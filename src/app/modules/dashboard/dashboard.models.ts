import { DriverSummary } from 'src/app/core/models/driver.models';
import { TripSummary } from 'src/app/core/models/trip.models';

export interface DashboardVm {
  activeTrips: number;
  completedToday: number;
  flaggedTrips: number;
  totalDrivers: number;
  approvedDrivers: number;
  pendingDrivers: number;
  suspendedDrivers: number;
  openFlags: number;
  resolvedFlags: number;
  recentTrips: TripSummary[];
  recentDrivers: DriverSummary[];
}
