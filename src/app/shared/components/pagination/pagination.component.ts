import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PaginationMeta } from 'src/app/core/models/api.models';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  standalone: false,
})
export class PaginationComponent {
  @Input() meta: PaginationMeta | null = null;
  @Output() pageChange = new EventEmitter<number>();

  get collectionSize(): number {
    return this.toNumber(this.meta?.total);
  }

  get totalPages(): number {
    if (!this.meta) {
      return 0;
    }

    const total = this.toNumber(this.meta.total);
    const perPage = this.toNumber(this.meta.per_page) || 1;
    return Math.max(1, Math.ceil(total / perPage));
  }

  get currentPage(): number {
    return this.toNumber(this.meta?.current_page) || 1;
  }

  get showingFrom(): number {
    if (!this.meta || this.collectionSize === 0) {
      return 0;
    }

    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get showingTo(): number {
    if (!this.meta) {
      return 0;
    }

    return Math.min(this.currentPage * this.pageSize, this.collectionSize);
  }

  get pageSize(): number {
    return this.toNumber(this.meta?.per_page) || 10;
  }

  get hasPagination(): boolean {
    return Boolean(this.meta) && this.collectionSize > 0;
  }

  get canGoPrevious(): boolean {
    return this.currentPage > 1;
  }

  get canGoNext(): boolean {
    return this.currentPage < this.totalPages;
  }

  goToPrevious(): void {
    if (!this.canGoPrevious) {
      return;
    }

    this.pageChange.emit(this.currentPage - 1);
  }

  goToNext(): void {
    if (!this.canGoNext) {
      return;
    }

    this.pageChange.emit(this.currentPage + 1);
  }

  private toNumber(value: unknown): number {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
}
