import { TripSummary } from './trip.models';
import { UnitSummary } from './unit.models';

export type DriverStatus = 'pending' | 'approved' | 'suspended';
export type DriverUnitStatus = 'active' | 'inactive';
export type DriverId = string | number;

export interface DriverListFilters {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
  plate?: string;
}

export interface DriverSummary {
  id: DriverId;
  full_name: string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  plate_number?: string | null;
  license_number?: string | null;
  tricycle_color?: string | null;
  body_number?: string | null;
  status: DriverStatus | string;
  units?: UnitSummary[];
  created_at?: string;
  registered_by?: string | null;
  registered_at?: string | null;
  updated_at?: string | null;
}

export interface DriverDetail extends DriverSummary {
  address?: string | null;
  notes?: string | null;
  units?: UnitSummary[];
  trip_history?: TripSummary[];
  assigned_units?: UnitSummary[];
  recent_trips?: TripSummary[];
}

export interface CreateDriverPayload {
  full_name: string;
  license_number: string;
  unit_code: string;
  plate_number: string;
  tricycle_color: string;
  body_number: string;
  status?: DriverStatus | string | null;
  unit_status?: DriverUnitStatus | string | null;
}

export interface UpdateDriverPayload {
  full_name: string;
  license_number: string;
  plate_number: string;
  tricycle_color: string;
  body_number: string;
  status?: DriverStatus | string | null;
}

export interface UpdateDriverStatusPayload {
  status: DriverStatus | string;
}
