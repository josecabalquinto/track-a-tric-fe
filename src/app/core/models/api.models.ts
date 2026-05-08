export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error?: string;
  message?: string;
}

export interface PaginationMeta {
  current_page: number;
  total: number;
  per_page: number;
}

export interface PaginatedPayload<T> {
  items: T[];
  meta: PaginationMeta;
}

export interface SelectOption<T = string> {
  label: string;
  value: T;
}
