import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { CitywallService } from './citywall.service';

@Component({
  selector: 'app-citywall-qr-preview',
  templateUrl: './citywall-qr-preview.component.html',
  standalone: false,
})
export class CitywallQrPreviewComponent implements OnInit {
  qrCodeUrl: string | null = null;
  qrSvg: string | null = null;
  isLoading = true;
  errorMessage = '';

  constructor(private route: ActivatedRoute, private citywallService: CitywallService) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadQr(id);
  }

  reload(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadQr(id);
  }

  private loadQr(id: number): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.citywallService
      .getUnitQr(id)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (payload) => {
          this.qrCodeUrl = payload.qr_code_url ?? null;
          this.qrSvg = payload.svg ?? null;
        },
        error: (error: Error) => {
          this.errorMessage = error.message;
        },
      });
  }
}
