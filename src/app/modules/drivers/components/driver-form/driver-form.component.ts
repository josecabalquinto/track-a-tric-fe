import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import {
  CreateDriverPayload,
  DriverDetail,
  DriverStatus,
  DriverUnitStatus,
  UpdateDriverPayload,
} from 'src/app/core/models/driver.models';
import { ToastrService } from 'src/app/core/services/toastr.service';
import { DriversService } from '../../services/drivers.service';

@Component({
  selector: 'app-driver-form',
  templateUrl: './driver-form.component.html',
  styleUrls: ['./driver-form.component.scss'],
  standalone: false,
})
export class DriverFormComponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  isSaving = false;
  isSubmitted = false;
  saveError = '';
  driver: DriverDetail | null = null;
  readonly statusOptions: DriverStatus[] = ['pending', 'approved', 'suspended'];
  readonly unitStatusOptions: DriverUnitStatus[] = ['active', 'inactive'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private driversService: DriversService,
    private toastr: ToastrService
  ) {
    this.form = this.fb.group({
      full_name: ['', [Validators.required, Validators.maxLength(255)]],
      license_number: ['', [Validators.required, Validators.maxLength(255)]],
      unit_code: ['', [Validators.required, Validators.maxLength(255)]],
      plate_number: ['', [Validators.required, Validators.maxLength(255)]],
      tricycle_color: ['', [Validators.required, Validators.maxLength(255)]],
      body_number: ['', [Validators.required, Validators.maxLength(255)]],
      status: ['pending', Validators.required],
      unit_status: ['active'],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.isEdit = Boolean(id);
    this.configureFormForMode();

    if (id) {
      this.driversService.getDriver(id).subscribe((driver) => {
        this.driver = driver;
        this.patchDriverForm(driver);
      });
    }
  }

  submit(): void {
    this.isSubmitted = true;
    this.saveError = '';
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.toastr.warning('Please correct the highlighted fields before submitting.', 'Validation Required');
      return;
    }

    this.isSaving = true;
    const request =
      this.isEdit && this.driver
        ? this.driversService.updateDriver(this.driver.id, this.buildUpdatePayload())
        : this.driversService.createDriver(this.buildCreatePayload());

    request.pipe(finalize(() => (this.isSaving = false))).subscribe({
      next: (driver) => {
        this.saveError = '';
        this.isSubmitted = false;

        if (this.isEdit) {
          this.driver = driver;
          this.patchDriverForm(driver);
        } else {
          this.resetCreateForm();
        }

        this.toastr.success(
          this.isEdit ? 'Driver record updated.' : 'Driver registered successfully.',
          this.isEdit ? 'Driver Updated' : 'Driver Created'
        );
      },
      error: (error: Error) => {
        this.saveError = error.message;
        this.toastr.error(error.message, 'Unable to Save Driver');
      },
    });
  }

  get f(): Record<string, AbstractControl> {
    return this.form.controls;
  }

  get fullNameLabel(): string {
    return this.isEdit ? 'Update Driver' : 'Register Driver';
  }

  get pageDescription(): string {
    return this.isEdit
      ? 'Review and update the driver and assigned unit details.'
      : 'Enter the driver and unit details to get them registered in the system.';
  }

  get submitLabel(): string {
    if (this.isSaving) {
      return this.isEdit ? 'Saving Changes...' : 'Submitting Driver...';
    }

    return this.isEdit ? 'Update Driver' : 'Submit Driver';
  }

  hasControlError(controlName: string): boolean {
    const control = this.form.get(controlName);
    return Boolean(control && control.invalid && (control.touched || control.dirty || this.isSubmitted));
  }

  getControlError(controlName: string, label: string): string {
    const control = this.form.get(controlName);

    if (!control || !this.hasControlError(controlName)) {
      return '';
    }

    if (control.hasError('required')) {
      return `${label} is required.`;
    }

    if (control.hasError('maxlength')) {
      const maxLength = control.getError('maxlength')?.requiredLength;
      return `${label} must not exceed ${maxLength} characters.`;
    }

    return `Please enter a valid ${label.toLowerCase()}.`;
  }

  private configureFormForMode(): void {
    const unitCodeControl = this.form.get('unit_code');

    if (!unitCodeControl) {
      return;
    }

    if (this.isEdit) {
      unitCodeControl.clearValidators();
      unitCodeControl.updateValueAndValidity();
      return;
    }

    unitCodeControl.setValidators([Validators.required, Validators.maxLength(255)]);
    unitCodeControl.updateValueAndValidity();
  }

  private patchDriverForm(driver: DriverDetail): void {
    this.form.reset({
      full_name: driver.full_name || driver.name || '',
      license_number: driver.license_number || '',
      unit_code: '',
      plate_number: driver.plate_number || '',
      tricycle_color: driver.tricycle_color || '',
      body_number: driver.body_number || '',
      status: driver.status || 'pending',
      unit_status: 'active',
    });
  }

  private resetCreateForm(): void {
    this.form.reset({
      full_name: '',
      license_number: '',
      unit_code: '',
      plate_number: '',
      tricycle_color: '',
      body_number: '',
      status: 'pending',
      unit_status: 'active',
    });
  }

  private buildCreatePayload(): CreateDriverPayload {
    const formValue = this.form.getRawValue();

    return {
      full_name: formValue.full_name,
      license_number: formValue.license_number,
      unit_code: formValue.unit_code,
      plate_number: formValue.plate_number,
      tricycle_color: formValue.tricycle_color,
      body_number: formValue.body_number,
      status: formValue.status || null,
      unit_status: formValue.unit_status || null,
    };
  }

  private buildUpdatePayload(): UpdateDriverPayload {
    const formValue = this.form.getRawValue();

    return {
      full_name: formValue.full_name,
      license_number: formValue.license_number,
      plate_number: formValue.plate_number,
      tricycle_color: formValue.tricycle_color,
      body_number: formValue.body_number,
      status: formValue.status || null,
    };
  }
}
