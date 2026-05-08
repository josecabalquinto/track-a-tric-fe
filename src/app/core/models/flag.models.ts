export type FlagStatus = 'open' | 'resolved' | 'dismissed';

export interface TripFlag {
  id: number;
  trip_id: number;
  category?: string | null;
  reason: string;
  notes?: string | null;
  status: FlagStatus;
  created_at: string;
  updated_at: string;
  created_by?: {
    id: number;
    name: string;
  } | null;
}

export interface CreateFlagPayload {
  reason: string;
  notes?: string;
  category?: string;
}

export interface UpdateFlagPayload {
  status: FlagStatus;
  notes?: string;
}
