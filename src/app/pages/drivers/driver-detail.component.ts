import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { DriverDetail } from 'src/app/core/models/driver.models';
import { DriversService } from './drivers.service';

@Component({
  selector: 'app-driver-detail',
  templateUrl: './driver-detail.component.html',
  standalone: false,
})
export class DriverDetailComponent implements OnInit {
  driver: DriverDetail | null = null;
  isLoading = true;
  isUpdating = false;
  errorMessage = '';

  constructor(private route: ActivatedRoute, private driversService: DriversService) {}

  ngOnInit(): void {
    this.loadDriver();
  }

  updateStatus(status: 'approved' | 'suspended'): void {
    if (!this.driver) {
      return;
    }

    this.isUpdating = true;
    this.driversService
      .updateStatus(this.driver.id, { status })
      .pipe(finalize(() => (this.isUpdating = false)))
      .subscribe({
        next: (driver) => {
          this.driver = driver;
        },
        error: (error: Error) => {
          this.errorMessage = error.message;
        },
      });
  }

  private loadDriver(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.isLoading = true;
    this.driversService
      .getDriver(id)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (driver) => {
          this.driver = driver;
        },
        error: (error: Error) => {
          this.errorMessage = error.message;
        },
      });
  }
}
