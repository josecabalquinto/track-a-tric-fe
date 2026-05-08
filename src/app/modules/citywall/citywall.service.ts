import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { ApiSuccessResponse } from 'src/app/core/models/api.models';
import { CreateUnitPayload, UnitSummary } from 'src/app/core/models/unit.models';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class CitywallService {
  private readonly baseUrl = `${environment.apiUrl}/citywall`;

  constructor(private http: HttpClient, private errorHandler: ErrorHandlerService) {}

  createUnit(payload: CreateUnitPayload): Observable<UnitSummary> {
    return this.http.post<ApiSuccessResponse<UnitSummary>>(`${this.baseUrl}/units`, payload).pipe(
      map((response) => response.data),
      catchError((error) => this.errorHandler.toObservable(error))
    );
  }

  getUnitQr(id: number): Observable<{ qr_code_url?: string | null; svg?: string | null }> {
    return this.http.get<ApiSuccessResponse<{ qr_code_url?: string | null; svg?: string | null }>>(`${this.baseUrl}/units/${id}/qr`).pipe(
      map((response) => response.data),
      catchError((error) => this.errorHandler.toObservable(error))
    );
  }
}
