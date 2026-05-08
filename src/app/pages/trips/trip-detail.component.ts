import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';
import { TripFlag } from 'src/app/core/models/flag.models';
import { TripDetail, TripPing } from 'src/app/core/models/trip.models';
import { FlagFormModalComponent } from '../flags/flag-form-modal/flag-form-modal.component';
import { TripsService } from './trips.service';

@Component({
  selector: 'app-trip-detail',
  templateUrl: './trip-detail.component.html',
  standalone: false,
})
export class TripDetailComponent implements OnInit {
  trip: TripDetail | null = null;
  pings: TripPing[] = [];
  isLoading = true;
  mapLoading = true;
  savingFlag = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private tripsService: TripsService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    const tripId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadTrip(tripId);
    this.loadPings(tripId);
  }

  openCreateFlag(): void {
    const modalRef = this.modalService.open(FlagFormModalComponent, { size: 'lg' });
    const component = modalRef.componentInstance as FlagFormModalComponent;
    component.mode = 'create';
    component.submitted.subscribe((payload) => {
      if (!this.trip) {
        return;
      }

      this.savingFlag = true;
      this.tripsService
        .createFlag(this.trip.id, {
          reason: payload.reason ?? '',
          notes: payload.notes,
          category: payload.category,
        })
        .pipe(finalize(() => (this.savingFlag = false)))
        .subscribe({
          next: (flag) => {
            this.trip = {
              ...this.trip!,
              flags: [flag, ...(this.trip?.flags ?? [])],
            };
            modalRef.close();
          },
        });
    });
  }

  updateFlag(flag: TripFlag): void {
    const modalRef = this.modalService.open(FlagFormModalComponent, { size: 'lg' });
    const component = modalRef.componentInstance as FlagFormModalComponent;
    component.mode = 'update';
    component.flag = flag;
    component.submitted.subscribe((payload) => {
      this.savingFlag = true;
      this.tripsService
        .updateFlag(flag.id, {
          status: String(payload.status) as TripFlag['status'],
          notes: payload.notes,
        })
        .pipe(finalize(() => (this.savingFlag = false)))
        .subscribe({
          next: (updatedFlag) => {
            if (this.trip) {
              this.trip = {
                ...this.trip,
                flags: (this.trip.flags ?? []).map((item) => (item.id === updatedFlag.id ? updatedFlag : item)),
              };
            }
            modalRef.close();
          },
        });
    });
  }

  private loadTrip(tripId: number): void {
    this.isLoading = true;
    this.tripsService
      .getTrip(tripId)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (trip) => {
          this.trip = trip;
        },
        error: (error: Error) => {
          this.errorMessage = error.message;
        },
      });
  }

  private loadPings(tripId: number): void {
    this.mapLoading = true;
    this.tripsService
      .getTripPings(tripId)
      .pipe(finalize(() => (this.mapLoading = false)))
      .subscribe({
        next: (pings) => {
          this.pings = pings;
        },
        error: (error: Error) => {
          this.errorMessage = error.message;
        },
      });
  }
}
