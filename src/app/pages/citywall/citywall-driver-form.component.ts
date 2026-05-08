import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { DriverDetail } from 'src/app/core/models/driver.models';
import { CitywallService } from './citywall.service';
import { DriversService } from '../drivers/drivers.service';

@Component({
  selector: 'app-citywall-driver-form',
  templateUrl: './citywall-driver-form.component.html',
  standalone: false,
})
export class CitywallDriverFormComponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  isSaving = false;
  errorMessage = '';
  successMessage = '';
  driver: DriverDetail | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private citywallService: CitywallService,
    private driversService: DriversService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      plate_number: [''],
      license_number: [''],
      address: [''],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.isEdit = Boolean(id);
    if (id) {
      this.driversService.getDriver(Number(id)).subscribe((driver) => {
        this.driver = driver;
        this.form.patchValue(driver);
      });
    }
  }

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';
    this.isSaving = true;
    const request = this.isEdit && this.driver
      ? this.citywallService.updateDriver(this.driver.id, this.form.getRawValue())
      : this.citywallService.createDriver(this.form.getRawValue());

    request.pipe(finalize(() => (this.isSaving = false))).subscribe({
      next: () => {
        this.successMessage = this.isEdit ? 'Driver record updated.' : 'Driver registered successfully.';
      },
      error: (error: Error) => {
        this.errorMessage = error.message;
      },
    });
  }
}
