import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { DriverSummary } from 'src/app/core/models/driver.models';
import { PaginationMeta } from 'src/app/core/models/api.models';
import { DriversService } from './drivers.service';

@Component({
  selector: 'app-drivers-list',
  templateUrl: './drivers-list.component.html',
  standalone: false,
})
export class DriversListComponent implements OnInit {
  form: FormGroup;
  drivers: DriverSummary[] = [];
  meta: PaginationMeta | null = null;
  isLoading = false;
  errorMessage = '';

  constructor(private fb: FormBuilder, private driversService: DriversService) {
    this.form = this.fb.group({
      search: [''],
      status: [''],
      plate: [''],
    });
  }

  ngOnInit(): void {
    this.loadDrivers(1);
  }

  loadDrivers(page: number): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.driversService
      .getDrivers({
        page,
        per_page: 10,
        ...this.form.getRawValue(),
      })
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (result) => {
          this.drivers = result.items;
          this.meta = result.meta;
        },
        error: (error: Error) => {
          this.errorMessage = error.message;
        },
      });
  }
}
