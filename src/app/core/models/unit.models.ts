export interface UnitSummary {
  id: number;
  code: string;
  plate_number: string;
  qr_code_url?: string | null;
  status?: string | null;
}

export interface CreateUnitPayload {
  code: string;
  plate_number: string;
  description?: string;
}
