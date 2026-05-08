export interface UnitSummary {
  id: string | number;
  code?: string | null;
  unit_code?: string | null;
  driver_id?: string | number | null;
  plate_number?: string | null;
  tricycle_color?: string | null;
  body_number?: string | null;
  qr_code_url?: string | null;
  qr_url?: string | null;
  status?: string | null;
  issued_at?: string | null;
  updated_at?: string | null;
}

export interface CreateUnitPayload {
  code: string;
  plate_number: string;
  description?: string;
}
