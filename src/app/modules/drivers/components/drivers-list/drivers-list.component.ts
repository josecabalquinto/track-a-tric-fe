import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { PaginationMeta } from 'src/app/core/models/api.models';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { DriverSummary } from '../../models/drivers.model';
import { DriversService } from '../../services/drivers.service';

@Component({
  selector: 'app-drivers-list',
  templateUrl: './drivers-list.component.html',
  styleUrls: ['./drivers-list.component.scss'],
  standalone: false,
})
export class DriversListComponent implements OnInit {
  form: FormGroup;
  drivers: DriverSummary[] = [];
  meta: PaginationMeta | null = null;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private driversService: DriversService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      search: [''],
      status: [''],
      plate: [''],
    });
  }

  ngOnInit(): void {
    this.loadDrivers(1);
  }

  get isSuperadmin(): boolean {
    return this.authService.hasRole('superadmin');
  }

  applyFilters(): void {
    this.loadDrivers(1);
  }

  resetFilters(): void {
    this.form.reset({
      search: '',
      status: '',
      plate: '',
    });
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
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (result) => {
          this.drivers = result.items;
          this.meta = result.meta;
          this.cdr.detectChanges();
        },
        error: (error: Error) => {
          this.errorMessage = error.message;
          this.cdr.detectChanges();
        },
      });
  }
}
