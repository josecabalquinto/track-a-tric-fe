import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { EmptyStateComponent } from './components/empty-state/empty-state.component';
import { LoadingStateComponent } from './components/loading-state/loading-state.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { StatCardComponent } from './components/stat-card/stat-card.component';

@NgModule({
  declarations: [
    LoadingStateComponent,
    EmptyStateComponent,
    PaginationComponent,
    StatCardComponent,
  ],
  imports: [CommonModule, RouterModule, NgbPaginationModule],
  exports: [
    CommonModule,
    RouterModule,
    NgbPaginationModule,
    LoadingStateComponent,
    EmptyStateComponent,
    PaginationComponent,
    StatCardComponent,
  ],
})
export class SharedUiModule {}
