import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-state',
  templateUrl: './loading-state.component.html',
  styleUrls: ['./loading-state.component.scss'],
  standalone: false,
})
export class LoadingStateComponent {
  @Input() label = 'Loading data...';
  @Input() rows = 5;

  get skeletonRows(): number[] {
    return Array.from({ length: this.rows }, (_, index) => index);
  }
}
