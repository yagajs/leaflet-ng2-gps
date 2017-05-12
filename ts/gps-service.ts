import {
    EventEmitter,
    Injectable,
} from '@angular/core';

@Injectable()
export class GpsService {
    /**
     * Last returned position
     */
    public position: Position;

    /**
     * EventEmitter that fires the current geo position
     */
    public positionChange: EventEmitter<Position> = new EventEmitter();
    /**
     * EventEmitter that fires the error if some occurs during observing
     */
    public error: EventEmitter<PositionError> = new EventEmitter();

    /**
     * Internal stored value of the highAccuracy state
     */
    protected highAccuracy: boolean = true;
    /**
     * Internal stored value for maximumAge
     */
    protected maximumAge: number = 20000;
    /**
     * Internal stored value for timeout
     */
    protected timeout: number = 3000;

    /**
     * Internal stored identifier for watchPosition
     * @link https://www.w3.org/TR/geolocation-API/#watch-position
     */
    private watchId: number;

    /**
     * Startobseriving the geolocation
     */
    public start(): Promise<Position> {
        return new Promise((resolve, reject) => {
            if (this.watchId) {
                return resolve(this.position);
            }

            let resolved: boolean = false; // resolves only the first answer

            this.watchId = navigator.geolocation.watchPosition((position: Position) => {
                this.position = position;
                this.positionChange.emit(position);
                if (!resolved) {
                    resolved = true;
                    return resolve(position);
                }
            }, (err: PositionError) => {
                this.error.emit(err);
                if (!resolved) {
                    resolved = true;
                    return reject(new Error(err.message));
                }
            }, {
                enableHighAccuracy: this.highAccuracy,
                maximumAge: this.maximumAge,
                timeout: this.timeout,
            });
        });

    }

    /**
     * Stops observing geo-location. Returns false in promise when it was not watching
     */
    public stop(): Promise<boolean> {
        if (!this.watchId) {
            return Promise.resolve(false);
        }
        navigator.geolocation.clearWatch(this.watchId);
        this.watchId = undefined;
        return Promise.resolve(true);
    }

    /**
     * Enables the GPS high accuracy mode
     * @link https://www.w3.org/TR/geolocation-API/#position_options_interface
     */
    public enableHighAccuracy(): void {
        this.highAccuracy = true;
        this.reload();
    }
    /**
     * Disables the GPS high accuracy mode
     * @link https://www.w3.org/TR/geolocation-API/#position_options_interface
     */
    public disableHighAccuracy() {
        this.highAccuracy = false;
        this.reload();
    }
    /**
     * The timeout attribute denotes the maximum length of time (expressed in milliseconds) that is allowed to pass from
     * the request until the corresponding retrieval of coordinates is invoked.
     * @link https://www.w3.org/TR/geolocation-API/#position_options_interface
     */
    public setTimeout(val: number) {
        this.timeout = val;
        this.reload();
    }
    /**
     * The maximumAge attribute indicates that the application is willing to accept a cached position whose age is no
     * greater than the specified time in milliseconds.
     * @link https://www.w3.org/TR/geolocation-API/#position_options_interface
     */
    public setMaximumAge(val: number) {
        this.maximumAge = val;
        this.reload();
    }

    /**
     * Reinitialize the Geolocation-API after changing its options
     */
    protected reload(): Promise<Position> {
        return this.stop()
            .then(() => {
                return this.start();
            });
    }

}
