import { NgModule } from "@angular/core";

import { GpsDirective } from "./gps-directive";
import { GpsService } from "./gps-service";

@NgModule({
    declarations: [
        GpsDirective,
    ],
    exports: [
        GpsDirective,
    ],
    providers: [
        GpsService,
    ],
})
export class YagaGpsModule { }
