import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  templateUrl: './empty-state.component.html',
  standalone: false,
})
export class EmptyStateComponent {
  @Input() title = 'No records found';
  @Input() description = 'Adjust your filters or check back later.';
}
