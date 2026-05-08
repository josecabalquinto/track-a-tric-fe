import { Component, Input } from '@angular/core';
import { FlagStatus } from 'src/app/core/models/flag.models';

@Component({
  selector: 'app-flag-status-badge',
  template: `<span class="badge text-uppercase" [ngClass]="cssClass">{{ status }}</span>`,
  standalone: false,
})
export class FlagStatusBadgeComponent {
  @Input() status: FlagStatus | string = 'open';

  get cssClass(): string {
    switch (this.status) {
      case 'resolved':
        return 'badge-light-success';
      case 'dismissed':
        return 'badge-light-secondary';
      default:
        return 'badge-light-warning';
    }
  }
}
