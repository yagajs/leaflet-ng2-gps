import {
    AfterContentInit,
    ContentChildren,
    Directive,
    Inject,
    Input,
    QueryList,
} from '@angular/core';
import {
    CircleDirective,
    CircleMarkerDirective,
    MarkerDirective,
} from '@yaga/leaflet-ng2';

import { GpsService } from './gps-service';

/**
 * GPS component
 * TODO: @example https://leaflet-ng2.yagajs.org/latest/examples/tile-layer-directive
 */
@Directive({
    selector: 'yaga-gps',
})
export class GpsDirective implements AfterContentInit {
    /**
     * Available content children of Circle directives
     */
    @ContentChildren(CircleDirective) public circleDirectives: QueryList<CircleDirective<any>>;
    /**
     * Available content children of CircleMarker directives
     */
    @ContentChildren(CircleMarkerDirective) public circleMarkerDirectives: QueryList<CircleMarkerDirective<any>>;
    /**
     * Available content children of Marker directives
     */
    @ContentChildren(MarkerDirective) public markerDirectives: QueryList<MarkerDirective>;

    /**
     * Display state of all directives (Circle, CircleMarker, Marker) under the yaga-gps directive
     */
    public get display(): boolean {
        return this.displayState;
    }
    @Input() public set display(val: boolean) {
        this.displayState = val;

        const setDisplay = (elem: any) => {
            elem.display = val;
        };

        if (this.circleDirectives) {
            this.circleDirectives.forEach(setDisplay);
        }
        if (this.circleMarkerDirectives) {
            this.circleMarkerDirectives.forEach(setDisplay);
        }
        if (this.markerDirectives) {
            this.markerDirectives.forEach(setDisplay);
        }
    }

    /**
     * GPS state for this directive
     */
    public get active(): boolean {
        return this.activeState;
    }
    @Input() public set active(val: boolean) {
        this.activeState = val;

        if (val) {
            this.gpsService.start().catch((err: Error) => {
                console.warn('TODO: handle Error!'); // TODO
                return console.error(err);
            });
        } else {
            this.gpsService.stop().catch((err: Error) => {
                console.warn('TODO: handle Error!'); // TODO
                return console.error(err);
            });
        }
    }

    /**
     * Internally stored value for the active state
     */
    private activeState: boolean = false;
    /**
     * Internally stored value for the display state
     */
    private displayState: boolean = false;

    constructor(@Inject(GpsService) public gpsService: GpsService) {
        gpsService.positionChange.subscribe((position: Position) => {
            this.circleDirectives.forEach((elem: CircleDirective<any>) => {
                elem.setRadius(position.coords.accuracy);
                elem.setLatLng([position.coords.latitude, position.coords.longitude]);
            });
            this.circleMarkerDirectives.forEach((elem: CircleMarkerDirective<any>) => {
                elem.setLatLng([position.coords.latitude, position.coords.longitude]);
            });
            this.markerDirectives.forEach((elem: MarkerDirective) => {
                elem.setLatLng([position.coords.latitude, position.coords.longitude]);
            });
        });
    }

    /**
     * This function gets called from Angular after initializing the html-component.
     * @link https://angular.io/docs/ts/latest/api/core/index/AfterContentInit-interface.html
     */
    public ngAfterContentInit(): void {
        this.display = this.displayState;
    }

}
