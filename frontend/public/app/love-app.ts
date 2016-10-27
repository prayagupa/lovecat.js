
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {LoveAppModule} from "./love-app.module";


const platform = platformBrowserDynamic();
platform.bootstrapModule(LoveAppModule);
