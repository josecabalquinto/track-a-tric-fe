import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { ToastrService } from 'src/app/core/services/toastr.service';
import { UnitSummary } from 'src/app/core/models/unit.models';
import { CitywallService } from './citywall.service';

@Component({
  selector: 'app-citywall-unit-form',
  templateUrl: './citywall-unit-form.component.html',
  standalone: false,
})
export class CitywallUnitFormComponent {
  form: FormGroup;
  isSaving = false;
  createdUnit: UnitSummary | null = null;

  constructor(
    private fb: FormBuilder,
    private citywallService: CitywallService,
    private toastr: ToastrService
  ) {
    this.form = this.fb.group({
      code: ['', Validators.required],
      plate_number: ['', Validators.required],
      description: [''],
    });
  }

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    this.isSaving = true;
    this.citywallService
      .createUnit(this.form.getRawValue())
      .pipe(finalize(() => (this.isSaving = false)))
      .subscribe({
        next: (unit) => {
          this.createdUnit = unit;
          this.toastr.success(`Unit created for ${unit.plate_number}.`, 'Unit Created');
        },
        error: (error: Error) => {
          this.toastr.error(error.message, 'Unable to Create Unit');
        },
      });
  }
}
