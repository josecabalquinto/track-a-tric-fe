import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { DashboardVm } from './dashboard.models';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: false,
})
export class DashboardComponent implements OnInit {
  vm: DashboardVm | null = null;
  isLoading = true;
  errorMessage = '';

  quickLinks = [
    { label: 'Investigate Trips', route: '/trips', tone: 'btn-light-primary' },
    { label: 'Manage Drivers', route: '/drivers', tone: 'btn-light-success' },
    { label: 'Citywall Controls', route: '/citywall', tone: 'btn-light-warning' },
  ];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.dashboardService
      .loadOverview()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (vm) => {
          this.vm = vm;
        },
        error: (error: Error) => {
          this.errorMessage = error.message;
        },
      });
  }
}
