import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedUiModule } from 'src/app/shared/shared-ui.module';
import { FlagFormModalComponent } from './flag-form-modal/flag-form-modal.component';
import { FlagStatusBadgeComponent } from './flag-status-badge/flag-status-badge.component';

@NgModule({
  declarations: [FlagFormModalComponent, FlagStatusBadgeComponent],
  imports: [CommonModule, ReactiveFormsModule, NgbModalModule, SharedUiModule],
  exports: [FlagFormModalComponent, FlagStatusBadgeComponent],
})
export class FlagsModule {}
