import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
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
  errorMessage = '';
  createdUnit: UnitSummary | null = null;

  constructor(private fb: FormBuilder, private citywallService: CitywallService) {
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

    this.errorMessage = '';
    this.isSaving = true;
    this.citywallService
      .createUnit(this.form.getRawValue())
      .pipe(finalize(() => (this.isSaving = false)))
      .subscribe({
        next: (unit) => {
          this.createdUnit = unit;
        },
        error: (error: Error) => {
          this.errorMessage = error.message;
        },
      });
  }
}
