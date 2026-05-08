import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
import { TripPing } from 'src/app/core/models/trip.models';

declare const L: any;

@Component({
  selector: 'app-trip-route-map',
  template: `<div #mapContainer class="rounded min-h-400px w-100"></div>`,
  standalone: false,
})
export class TripRouteMapComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() pings: TripPing[] = [];
  @ViewChild('mapContainer') mapContainer!: ElementRef<HTMLDivElement>;

  private map?: any;
  private layerGroup?: any;

  ngAfterViewInit(): void {
    this.ensureMap();
    this.renderRoute();
  }

  ngOnChanges(_changes: SimpleChanges): void {
    this.renderRoute();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  private ensureMap(): void {
    if (this.map || !this.mapContainer) {
      return;
    }

    this.map = L.map(this.mapContainer.nativeElement, {
      zoomControl: true,
    }).setView([14.5995, 120.9842], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);

    this.layerGroup = L.layerGroup().addTo(this.map);
  }

  private renderRoute(): void {
    if (!this.mapContainer) {
      return;
    }

    this.ensureMap();
    if (!this.layerGroup) {
      return;
    }

    this.layerGroup.clearLayers();
    if (!this.pings.length) {
      return;
    }

    const coordinates = this.pings.map((ping) => [Number(ping.latitude), Number(ping.longitude)]);
    const polyline = L.polyline(coordinates, {
      color: '#0d6efd',
      weight: 4,
      opacity: 0.85,
    }).addTo(this.layerGroup);

    const start = this.pings[0];
    const end = this.pings[this.pings.length - 1];

    L.marker([start.latitude, start.longitude]).bindPopup(`Start<br>${new Date(start.recorded_at).toLocaleString()}`).addTo(this.layerGroup);
    L.marker([end.latitude, end.longitude]).bindPopup(`End<br>${new Date(end.recorded_at).toLocaleString()}`).addTo(this.layerGroup);

    this.pings.forEach((ping, index) => {
      L.circleMarker([ping.latitude, ping.longitude], {
        radius: index === 0 || index === this.pings.length - 1 ? 5 : 3,
        color: '#3f4254',
        weight: 1,
        fillColor: '#ffffff',
        fillOpacity: 0.95,
      })
        .bindTooltip(
          `<strong>${new Date(ping.recorded_at).toLocaleString()}</strong><br>Speed: ${ping.speed ?? 'n/a'}<br>Accuracy: ${ping.accuracy ?? 'n/a'}`
        )
        .addTo(this.layerGroup);
    });

    this.map.fitBounds(polyline.getBounds(), { padding: [24, 24] });
  }
}
