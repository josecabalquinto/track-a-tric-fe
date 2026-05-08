import { TripFlag } from './flag.models';
import { UnitSummary } from './unit.models';

export type TripStatus = 'active' | 'completed' | 'flagged' | 'cancelled';

export interface TripListFilters {
  page?: number;
  per_page?: number;
  plate?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
}

export interface TripDriverSummary {
  id: string | number;
  full_name?: string | null;
  name?: string | null;
  plate_number?: string | null;
  status?: string | null;
  phone?: string | null;
}

export interface TripSummary {
  id: number;
  trip_code?: string | null;
  session_token?: string | null;
  passenger_name?: string | null;
  status: TripStatus | string;
  started_at: string;
  ended_at?: string | null;
  distance_meters?: number | null;
  driver?: TripDriverSummary | null;
  unit?: UnitSummary | null;
  flags?: TripFlag[];
}

export interface TripDetail extends TripSummary {
  start_latitude?: number | null;
  start_longitude?: number | null;
  end_latitude?: number | null;
  end_longitude?: number | null;
  start_address?: string | null;
  end_address?: string | null;
  ping_count?: number;
}

export interface TripPing {
  id: number;
  trip_id: number;
  latitude: number;
  longitude: number;
  speed?: number | null;
  accuracy?: number | null;
  recorded_at: string;
}

export interface TripPingPayload {
  latitude: number;
  longitude: number;
  speed?: number;
  accuracy?: number;
  recorded_at?: string;
}

export interface QrScanResponse {
  trip_id: number;
  session_token: string;
  unit_code: string;
}
