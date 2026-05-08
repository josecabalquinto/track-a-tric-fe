import { TripSummary } from './trip.models';
import { UnitSummary } from './unit.models';

export type DriverStatus = 'pending' | 'approved' | 'suspended';

export interface DriverListFilters {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
  plate?: string;
}

export interface DriverSummary {
  id: number;
  name: string;
  email?: string | null;
  phone?: string | null;
  plate_number?: string | null;
  license_number?: string | null;
  status: DriverStatus | string;
  created_at?: string;
}

export interface DriverDetail extends DriverSummary {
  address?: string | null;
  notes?: string | null;
  assigned_units?: UnitSummary[];
  recent_trips?: TripSummary[];
}

export interface CreateDriverPayload {
  name: string;
  email: string;
  phone: string;
  plate_number?: string;
  license_number?: string;
  address?: string;
}

export interface UpdateDriverPayload extends CreateDriverPayload {}

export interface UpdateDriverStatusPayload {
  status: DriverStatus | string;
}
