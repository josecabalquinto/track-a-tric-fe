import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { ApiSuccessResponse, PaginatedPayload, PaginationMeta } from 'src/app/core/models/api.models';
import {
  CreateDriverPayload,
  DriverDetail,
  DriverId,
  DriverListFilters,
  DriverSummary,
  UpdateDriverPayload,
  UpdateDriverStatusPayload,
} from '../models/drivers.model';
import { UnitSummary } from 'src/app/core/models/unit.models';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class DriversService {
  private readonly baseUrl = `${environment.apiUrl}/admin/drivers`;

  constructor(private http: HttpClient, private errorHandler: ErrorHandlerService) {}

  getDrivers(filters: DriverListFilters): Observable<PaginatedPayload<DriverSummary>> {
    const params = this.buildParams(filters as Record<string, string | number | undefined>);
    return this.http
      .get<
        ApiSuccessResponse<DriverSummary[] | { items?: DriverSummary[]; data?: DriverSummary[]; meta?: PaginationMeta }> & {
          meta?: PaginationMeta;
        }
      >(this.baseUrl, { params })
      .pipe(
        map((response) => this.mapPaginatedDriversResponse(response, filters)),
        catchError((error) => this.errorHandler.toObservable(error))
      );
  }

  getDriver(id: DriverId): Observable<DriverDetail> {
    return this.http.get<ApiSuccessResponse<DriverDetail>>(`${this.baseUrl}/${id}`).pipe(
      map((response) => this.normalizeDriver(response.data) as DriverDetail),
      catchError((error) => this.errorHandler.toObservable(error))
    );
  }

  createDriver(payload: CreateDriverPayload): Observable<DriverDetail> {
    return this.http.post<ApiSuccessResponse<DriverDetail>>(`${environment.apiUrl}/citywall/drivers`, payload).pipe(
      map((response) => response.data),
      catchError((error) => this.errorHandler.toObservable(error))
    );
  }

  updateDriver(id: DriverId, payload: UpdateDriverPayload): Observable<DriverDetail> {
    return this.http.put<ApiSuccessResponse<DriverDetail>>(`${environment.apiUrl}/citywall/drivers/${id}`, payload).pipe(
      map((response) => response.data),
      catchError((error) => this.errorHandler.toObservable(error))
    );
  }

  deleteDriver(id: DriverId): Observable<null> {
    return this.http.delete<ApiSuccessResponse<null>>(`${environment.apiUrl}/citywall/drivers/${id}`).pipe(
      map((response) => response.data),
      catchError((error) => this.errorHandler.toObservable(error))
    );
  }

  updateStatus(id: DriverId, payload: UpdateDriverStatusPayload): Observable<DriverDetail> {
    return this.http.patch<ApiSuccessResponse<DriverDetail>>(`${this.baseUrl}/${id}/status`, payload).pipe(
      map((response) => response.data),
      catchError((error) => this.errorHandler.toObservable(error))
    );
  }

  private buildParams(filters: Record<string, string | number | undefined>): HttpParams {
    let params = new HttpParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params = params.set(key, String(value));
      }
    });
    return params;
  }

  private mapPaginatedDriversResponse(
    response: ApiSuccessResponse<DriverSummary[] | { items?: DriverSummary[]; data?: DriverSummary[]; meta?: PaginationMeta }> & {
      meta?: PaginationMeta;
    },
    filters: DriverListFilters
  ): PaginatedPayload<DriverSummary> {
    const payload = response.data;
    const items = (Array.isArray(payload) ? payload : payload.items ?? payload.data ?? []).map((driver) =>
      this.normalizeDriver(driver)
    );
    const meta = response.meta ?? (Array.isArray(payload) ? undefined : payload.meta);
    const fallbackPerPage = Number(filters.per_page ?? items.length ?? 10) || 10;

    return {
      items,
      meta: meta ?? {
        current_page: Number(filters.page ?? 1),
        total: items.length,
        per_page: fallbackPerPage,
      },
    };
  }

  private normalizeDriver<T extends DriverSummary | DriverDetail>(driver: T): T {
    const normalizedUnits = (driver.units ?? []).map((unit) => this.normalizeUnit(unit));
    const primaryUnit = normalizedUnits[0];

    return {
      ...driver,
      units: normalizedUnits,
      plate_number: driver.plate_number ?? primaryUnit?.plate_number ?? null,
      tricycle_color: driver.tricycle_color ?? primaryUnit?.tricycle_color ?? null,
      body_number: driver.body_number ?? primaryUnit?.body_number ?? null,
    };
  }

  private normalizeUnit(unit: UnitSummary): UnitSummary {
    return {
      ...unit,
      code: unit.code ?? unit.unit_code ?? null,
      unit_code: unit.unit_code ?? unit.code ?? null,
      qr_code_url: unit.qr_code_url ?? unit.qr_url ?? null,
      qr_url: unit.qr_url ?? unit.qr_code_url ?? null,
    };
  }
}
