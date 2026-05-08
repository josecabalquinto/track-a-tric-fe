import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PaginationMeta } from 'src/app/core/models/api.models';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  standalone: false,
})
export class PaginationComponent {
  @Input() meta: PaginationMeta | null = null;
  @Output() pageChange = new EventEmitter<number>();

  get collectionSize(): number {
    return this.meta?.total ?? 0;
  }

  get totalPages(): number {
    if (!this.meta) {
      return 0;
    }

    return Math.ceil(this.meta.total / this.meta.per_page);
  }
}
