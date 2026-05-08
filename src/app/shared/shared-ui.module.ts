import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbModalModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';
import { EmptyStateComponent } from './components/empty-state/empty-state.component';
import { LoadingStateComponent } from './components/loading-state/loading-state.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { StatCardComponent } from './components/stat-card/stat-card.component';
import { ToastContainerComponent } from './components/toast-container/toast-container.component';

@NgModule({
  declarations: [
    ConfirmationModalComponent,
    LoadingStateComponent,
    EmptyStateComponent,
    PaginationComponent,
    StatCardComponent,
    ToastContainerComponent,
  ],
  imports: [CommonModule, RouterModule, NgbPaginationModule, NgbModalModule],
  exports: [
    CommonModule,
    RouterModule,
    NgbModalModule,
    NgbPaginationModule,
    ConfirmationModalComponent,
    LoadingStateComponent,
    EmptyStateComponent,
    PaginationComponent,
    StatCardComponent,
    ToastContainerComponent,
  ],
})
export class SharedUiModule {}
