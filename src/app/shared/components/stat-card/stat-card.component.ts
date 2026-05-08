import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  templateUrl: './stat-card.component.html',
  standalone: false,
})
export class StatCardComponent {
  @Input() label = '';
  @Input() value = '0';
  @Input() hint = '';
  @Input() badgeClass = 'badge-light-primary';
}
