import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiSuccessResponse, PaginatedPayload } from 'src/app/core/models/api.models';
import {
  DriverDetail,
  DriverListFilters,
  DriverSummary,
  UpdateDriverStatusPayload,
} from 'src/app/core/models/driver.models';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';

@Injectable()
export class DriversService {
  private readonly baseUrl = `${environment.apiUrl}/admin/drivers`;

  constructor(private http: HttpClient, private errorHandler: ErrorHandlerService) {}

  getDrivers(filters: DriverListFilters): Observable<PaginatedPayload<DriverSummary>> {
    const params = this.buildParams(filters as Record<string, string | number | undefined>);
    return this.http
      .get<ApiSuccessResponse<{ items?: DriverSummary[]; data?: DriverSummary[]; meta: PaginatedPayload<DriverSummary>['meta'] }>>(this.baseUrl, { params })
      .pipe(
        map((response) => ({
          items: response.data.items ?? response.data.data ?? [],
          meta: response.data.meta,
        })),
        catchError((error) => this.errorHandler.toObservable(error))
      );
  }

  getDriver(id: number): Observable<DriverDetail> {
    return this.http.get<ApiSuccessResponse<DriverDetail>>(`${this.baseUrl}/${id}`).pipe(
      map((response) => response.data),
      catchError((error) => this.errorHandler.toObservable(error))
    );
  }

  updateStatus(id: number, payload: UpdateDriverStatusPayload): Observable<DriverDetail> {
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
}
