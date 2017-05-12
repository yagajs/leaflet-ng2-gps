# GPS Plugin for leaflet-ng2

This is a GPS service and directive for [YAGA's](https://yagajs.org) [leaflet-ng2](https://leaflet-ng2.yagajs.org).

## How to use

First install this module into your project with npm:

```bash
npm install --save @yaga/leaflet-ng2-gps
```

*Keep in mind that you have to add `@yaga/leaflet-ng2` as peer dependency*

Insert this module into your app module

```typescript
import { YagaModule } from '@yaga/leaflet-ng2';
import { GpsService, YagaGpsModule } from '@yaga/leaflet-ng2-gps';

// ...

@Component({
    selector: 'app',
    templateUrl: 'app.html',
})
export class AppComponent {
    // ...
}

@NgModule({
    bootstrap:    [ AppComponent ],
    declarations: [ AppComponent ],
    imports:      [ YagaGpsModule, YagaModule ],
})
export class AppModule {}

```

Use the `yaga-gps` directive in your template and use the Circle, CircleMarker or Marker directives within.
You can style the sub-directives like you with directly in the template. The `yaga-gps` directive take care about their
display state and position. In addition the radius of Circle directives gets set according to the GPS accuracy.

```html
<yaga-map [lat]="lat" [lng]="lng">
  <!-- other YAGA directives -->
  <yaga-gps [active]="activeState" [display]="displayState">
    <yaga-marker>
      <yaga-popup>
        This is your current position...
      </yaga-popup>
    </yaga-marker>
    <yaga-circle-marker [radius]="3" [color]="'blue'"></yaga-circle-marker>
    <yaga-circle [opacity]="0.4" [weight]="1" [color]="'#00c'" [fillColor]="'#33f'"></yaga-circle>
  </yaga-gps>
</yaga-map>
```

*Note: The radius of the CircleMarker directive will not be set by this directive (it makes no sense!)*
