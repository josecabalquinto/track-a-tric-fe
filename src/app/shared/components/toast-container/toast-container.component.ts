import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AppToast, ToastrService } from 'src/app/core/services/toastr.service';

@Component({
  selector: 'app-toast-container',
  templateUrl: './toast-container.component.html',
  styleUrls: ['./toast-container.component.scss'],
  standalone: false,
})
export class ToastContainerComponent {
  readonly toasts$: Observable<AppToast[]>;

  constructor(public toastr: ToastrService) {
    this.toasts$ = this.toastr.toasts$;
  }

  dismiss(id: number): void {
    this.toastr.dismiss(id);
  }

  handleClick(toast: AppToast): void {
    this.toastr.triggerClick(toast);
  }

  toMilliseconds(value: string, fallback: number): number {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
}
