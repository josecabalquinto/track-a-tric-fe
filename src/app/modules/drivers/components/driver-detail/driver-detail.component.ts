import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';
import { ToastrService } from 'src/app/core/services/toastr.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { ConfirmationModalComponent } from 'src/app/shared/components/confirmation-modal/confirmation-modal.component';
import { DriverDetail } from '../../models/drivers.model';
import { DriversService } from '../../services/drivers.service';

@Component({
  selector: 'app-driver-detail',
  templateUrl: './driver-detail.component.html',
  styleUrls: ['./driver-detail.component.scss'],
  standalone: false,
})
export class DriverDetailComponent implements OnInit {
  driver: DriverDetail | null = null;
  isLoading = true;
  isUpdating = false;
  isDeleting = false;
  errorMessage = '';
  activeTab: 'info' | 'units' | 'history' = 'info';

  constructor(
    private route: ActivatedRoute,
    private driversService: DriversService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    private router: Router,
    private authService: AuthService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadDriver();
  }

  get assignedUnits() {
    return this.driver?.units ?? this.driver?.assigned_units ?? [];
  }

  get tripHistory() {
    return this.driver?.trip_history ?? this.driver?.recent_trips ?? [];
  }

  get initials(): string {
    const source = (this.driver?.full_name || this.driver?.name || '').trim();
    if (!source) {
      return 'DR';
    }

    const parts = source.split(/\s+/).filter(Boolean);
    return parts
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('');
  }

  get statusBadgeClass(): string {
    switch (this.driver?.status) {
      case 'approved':
        return 'badge-light-success text-success';
      case 'suspended':
        return 'badge-light-warning text-warning';
      default:
        return 'badge-light-primary text-primary';
    }
  }

  get isSuperadmin(): boolean {
    return this.authService.hasRole('superadmin');
  }

  selectTab(tab: 'info' | 'units' | 'history'): void {
    this.activeTab = tab;
  }

  updateStatus(status: 'approved' | 'suspended'): void {
    if (!this.driver) {
      return;
    }

    this.isUpdating = true;
    this.driversService
      .updateStatus(this.driver.id, { status })
      .pipe(
        finalize(() => {
          this.isUpdating = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (driver) => {
          this.driver = driver;
          this.cdr.detectChanges();
        },
        error: (error: Error) => {
          this.errorMessage = error.message;
          this.cdr.detectChanges();
        },
      });
  }

  deleteDriver(): void {
    if (!this.driver || this.isDeleting) {
      return;
    }

    const modalRef = this.modalService.open(ConfirmationModalComponent, {
      centered: true,
      size: 'md',
    });
    const component = modalRef.componentInstance as ConfirmationModalComponent;
    component.title = 'Delete Driver';
    component.message = `Delete the driver record for ${this.driver.full_name || this.driver.name}? This action cannot be undone.`;
    component.confirmLabel = 'Delete Driver';
    component.cancelLabel = 'Keep Record';
    component.confirmButtonClass = 'btn-danger';
    component.iconClass = 'bi bi-trash';

    modalRef.closed.subscribe((confirmed) => {
      if (confirmed) {
        this.performDeleteDriver();
      }
    });
  }

  private performDeleteDriver(): void {
    if (!this.driver) {
      return;
    }

    this.isDeleting = true;
    this.driversService
      .deleteDriver(this.driver.id)
      .pipe(
        finalize(() => {
          this.isDeleting = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: () => {
          this.toastr.success('Driver deleted successfully.', 'Driver Deleted');
          this.router.navigate(['/drivers']);
        },
        error: (error: Error) => {
          this.errorMessage = error.message;
          this.toastr.error(error.message, 'Unable to Delete Driver');
          this.cdr.detectChanges();
        },
      });
  }

  private loadDriver(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.errorMessage = 'Driver record not found.';
      this.isLoading = false;
      this.cdr.detectChanges();
      return;
    }
    this.isLoading = true;
    this.driversService
      .getDriver(id)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (driver) => {
          this.driver = driver;
          this.cdr.detectChanges();
        },
        error: (error: Error) => {
          this.errorMessage = error.message;
          this.cdr.detectChanges();
        },
      });
  }
}
