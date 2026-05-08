import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-state',
  templateUrl: './loading-state.component.html',
  standalone: false,
})
export class LoadingStateComponent {
  @Input() label = 'Loading data...';
}
