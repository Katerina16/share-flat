/* eslint @typescript-eslint/no-explicit-any: 0 */

import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { mapMarkerPath } from '../../core/utils/map-marker-path';

declare const ymaps3: any;

@Component({
  selector: 'sf-map',
  standalone: true,
  template: '<div #mapWidget class="w-full" style="height: 400px"></div>'
})
export class MapComponent implements AfterViewInit {
  @ViewChild('mapWidget', { static: false }) mapWidget: ElementRef<HTMLElement>;
  @Input() latitude: number;
  @Input() longitude: number;

  ngAfterViewInit(): void {
    this.initMap();
  }

  async initMap(): Promise<void> {
    await ymaps3.ready;

    const content = document.createElement('div');
    content.classList.add('map-marker');
    content.style.backgroundImage = `url('${mapMarkerPath}')`;
    const marker = new ymaps3.YMapMarker({ coordinates: [this.longitude, this.latitude] }, content);

    new ymaps3.YMap(this.mapWidget.nativeElement, {
      location: {
        center: [this.longitude, this.latitude],
        zoom: 16
      }
    })
      .addChild(new ymaps3.YMapDefaultSchemeLayer())
      .addChild(new ymaps3.YMapDefaultFeaturesLayer({ zIndex: 1800 }))
      .addChild(marker);
  }
}
