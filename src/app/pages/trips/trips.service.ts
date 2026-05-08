import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PaginatedPayload, ApiSuccessResponse } from 'src/app/core/models/api.models';
import { CreateFlagPayload, TripFlag, UpdateFlagPayload } from 'src/app/core/models/flag.models';
import { QrScanResponse, TripDetail, TripListFilters, TripPing, TripPingPayload, TripSummary } from 'src/app/core/models/trip.models';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';

@Injectable()
export class TripsService {
  private readonly baseUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient, private errorHandler: ErrorHandlerService) {}

  getTrips(filters: TripListFilters): Observable<PaginatedPayload<TripSummary>> {
    const params = this.buildParams(filters as Record<string, string | number | undefined>);
    return this.http
      .get<ApiSuccessResponse<{ items?: TripSummary[]; data?: TripSummary[]; meta: PaginatedPayload<TripSummary>['meta'] }>>(`${this.baseUrl}/admin/trips`, { params })
      .pipe(
        map((response) => ({
          items: response.data.items ?? response.data.data ?? [],
          meta: response.data.meta,
        })),
        catchError((error) => this.errorHandler.toObservable(error))
      );
  }

  getTrip(id: number): Observable<TripDetail> {
    return this.http.get<ApiSuccessResponse<TripDetail>>(`${this.baseUrl}/admin/trips/${id}`).pipe(
      map((response) => response.data),
      catchError((error) => this.errorHandler.toObservable(error))
    );
  }

  getTripPings(id: number): Observable<TripPing[]> {
    return this.http.get<ApiSuccessResponse<TripPing[] | { items?: TripPing[]; data?: TripPing[] }>>(`${this.baseUrl}/admin/trips/${id}/pings`).pipe(
      map((response) => {
        const payload = response.data;
        if (Array.isArray(payload)) {
          return payload;
        }

        return payload.items ?? payload.data ?? [];
      }),
      map((pings) =>
        pings
          .map((ping) => ({
            ...ping,
            latitude: Number(ping.latitude),
            longitude: Number(ping.longitude),
            speed: ping.speed == null ? null : Number(ping.speed),
            accuracy: ping.accuracy == null ? null : Number(ping.accuracy),
          }))
          .sort((left, right) => new Date(left.recorded_at).getTime() - new Date(right.recorded_at).getTime())
      ),
      catchError((error) => this.errorHandler.toObservable(error))
    );
  }

  createFlag(tripId: number, payload: CreateFlagPayload): Observable<TripFlag> {
    return this.http.post<ApiSuccessResponse<TripFlag>>(`${this.baseUrl}/admin/trips/${tripId}/flags`, payload).pipe(
      map((response) => response.data),
      catchError((error) => this.errorHandler.toObservable(error))
    );
  }

  updateFlag(flagId: number, payload: UpdateFlagPayload): Observable<TripFlag> {
    return this.http.patch<ApiSuccessResponse<TripFlag>>(`${this.baseUrl}/admin/flags/${flagId}`, payload).pipe(
      map((response) => response.data),
      catchError((error) => this.errorHandler.toObservable(error))
    );
  }

  scanQr(unitCode: string): Observable<QrScanResponse> {
    return this.http.post<ApiSuccessResponse<QrScanResponse>>(`${this.baseUrl}/qr/${unitCode}/scan`, {}).pipe(
      map((response) => response.data),
      catchError((error) => this.errorHandler.toObservable(error))
    );
  }

  sendPing(tripId: number, sessionToken: string, payload: TripPingPayload): Observable<TripPing> {
    return this.http
      .post<ApiSuccessResponse<TripPing>>(`${this.baseUrl}/trips/${tripId}/pings`, payload, {
        headers: {
          'X-Session-Token': sessionToken,
        },
      })
      .pipe(
        map((response) => response.data),
        catchError((error) => this.errorHandler.toObservable(error))
      );
  }

  endTrip(tripId: number, sessionToken: string, payload: Partial<TripPingPayload> = {}): Observable<TripDetail> {
    return this.http
      .post<ApiSuccessResponse<TripDetail>>(`${this.baseUrl}/trips/${tripId}/end`, payload, {
        headers: {
          'X-Session-Token': sessionToken,
        },
      })
      .pipe(
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
