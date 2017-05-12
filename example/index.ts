// Shims
import 'reflect-metadata';
import 'zone.js';

import { OSM_TILE_LAYER_URL, YagaModule } from '@yaga/leaflet-ng2';

import { Component, EventEmitter, Inject, NgModule, PlatformRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { GpsService, YagaGpsModule } from '../lib/'; // @yaga/leaflet-ng2-gps

const platform: PlatformRef = platformBrowserDynamic();

/* tslint:disable:max-line-length */
const template: string = `
<div class="container">
  <div class="map">
    <yaga-map [lat]="lat" [lng]="lng">
      <yaga-tile-layer [(url)]="tileUrl"></yaga-tile-layer>
      <yaga-gps [active]="activeState" [display]="displayState">
        <yaga-circle-marker [radius]="3" [color]="'blue'"></yaga-circle-marker>
        <yaga-circle [opacity]="0.4" [weight]="1" [color]="'#00c'" [fillColor]="'#33f'"></yaga-circle>
      </yaga-gps>
      <yaga-attribution-control></yaga-attribution-control>
    </yaga-map>
  </div>
  <div class="input-group input-group-sx">
    <span class="input-group-addon fixed-space">active</span>
    <input type="checkbox" class="form-control" [(ngModel)]="activeState"/>
  </div> 
  <div class="input-group input-group-sx">
    <span class="input-group-addon fixed-space">display</span>
    <input type="checkbox" class="form-control" [(ngModel)]="displayState"/>
  </div> 
  <div class="input-group input-group-sx">
    <span class="input-group-addon fixed-space">follow</span>
    <input type="checkbox" class="form-control" [ngModel]="false" (ngModelChange)="setFollow($event)"/>
  </div> 
</div><!-- /.container -->
`;
/* tslint:enable */

@Component({
    selector: 'app',
    template,
})
export class AppComponent {
    public activeState: boolean = false;
    public displayState: boolean = false;
    public tileUrl = OSM_TILE_LAYER_URL;
    public lat: number = 0;
    public lng: number = 0;

    private gpsListener: EventEmitter<Position>;

    constructor(
        @Inject(GpsService) public gpsService: GpsService,
    ) {}

    public setFollow(val: boolean): void {
        if (val && !this.gpsListener) {
            if (this.gpsService.position) {
                this.lat = this.gpsService.position.coords.latitude;
                this.lng = this.gpsService.position.coords.longitude;
            }

            this.gpsListener = this.gpsService.positionChange.subscribe((position: Position) => {
                this.lat = position.coords.latitude;
                this.lng = position.coords.longitude;
            });
            return;
        }
        if (!val && this.gpsListener) {
            this.gpsListener.unsubscribe();
            this.gpsListener = null;
        }
    }
}

@NgModule({
    bootstrap:    [ AppComponent ],
    declarations: [ AppComponent ],
    imports:      [ BrowserModule, FormsModule, YagaGpsModule, YagaModule ],
})
export class AppModule {}

document.addEventListener('DOMContentLoaded', () => {
    platform.bootstrapModule(AppModule);
});
