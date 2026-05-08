import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedUiModule } from 'src/app/shared/shared-ui.module';
import { CitywallComponent } from './citywall.component';
import { CitywallQrPreviewComponent } from './citywall-qr-preview.component';
import { CitywallService } from './citywall.service';
import { CitywallUnitFormComponent } from './citywall-unit-form.component';

@NgModule({
  declarations: [
    CitywallComponent,
    CitywallUnitFormComponent,
    CitywallQrPreviewComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedUiModule,
    RouterModule.forChild([
      { path: '', component: CitywallComponent },
      { path: 'units/new', component: CitywallUnitFormComponent },
      { path: 'units/:id/qr', component: CitywallQrPreviewComponent },
    ]),
  ],
  providers: [CitywallService],
})
export class CitywallModule {}
