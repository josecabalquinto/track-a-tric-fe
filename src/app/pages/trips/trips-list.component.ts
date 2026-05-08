import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { PaginationMeta } from 'src/app/core/models/api.models';
import { TripSummary } from 'src/app/core/models/trip.models';
import { TripsService } from './trips.service';

@Component({
  selector: 'app-trips-list',
  templateUrl: './trips-list.component.html',
  standalone: false,
})
export class TripsListComponent implements OnInit {
  filtersForm: FormGroup;
  trips: TripSummary[] = [];
  meta: PaginationMeta | null = null;
  isLoading = false;
  errorMessage = '';

  constructor(private fb: FormBuilder, private tripsService: TripsService) {
    this.filtersForm = this.fb.group({
      plate: [''],
      status: [''],
      date_from: [''],
      date_to: [''],
    });
  }

  ngOnInit(): void {
    this.loadTrips(1);
  }

  applyFilters(): void {
    this.loadTrips(1);
  }

  resetFilters(): void {
    this.filtersForm.reset({
      plate: '',
      status: '',
      date_from: '',
      date_to: '',
    });
    this.loadTrips(1);
  }

  loadTrips(page: number): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.tripsService
      .getTrips({
        page,
        per_page: 10,
        ...this.filtersForm.getRawValue(),
      })
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (result) => {
          this.trips = result.items;
          this.meta = result.meta;
        },
        error: (error: Error) => {
          this.errorMessage = error.message;
        },
      });
  }
}
