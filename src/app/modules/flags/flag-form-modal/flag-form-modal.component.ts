import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TripFlag } from 'src/app/core/models/flag.models';

@Component({
  selector: 'app-flag-form-modal',
  templateUrl: './flag-form-modal.component.html',
  standalone: false,
})
export class FlagFormModalComponent implements OnChanges {
  @Input() mode: 'create' | 'update' = 'create';
  @Input() flag: TripFlag | null = null;
  @Input() saving = false;
  @Output() submitted = new EventEmitter<{ reason?: string; notes?: string; category?: string; status?: string }>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      category: [''],
      reason: ['', Validators.required],
      status: ['open'],
      notes: [''],
    });
  }

  ngOnChanges(_changes: SimpleChanges): void {
    if (this.flag) {
      this.form.patchValue({
        category: this.flag.category ?? '',
        reason: this.flag.reason,
        status: this.flag.status,
        notes: this.flag.notes ?? '',
      });
      return;
    }

    this.form.reset({
      category: '',
      reason: '',
      status: 'open',
      notes: '',
    });
  }

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    this.submitted.emit(this.form.getRawValue());
  }
}
