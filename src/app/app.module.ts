import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChartsModule } from 'ng2-charts';
import { DragulaModule } from 'ng2-dragula';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';

import { MaterialModule } from './material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { SetupComponent } from './setup/setup.component';
import { HeaderComponent } from './header/header.component';
import { WeatherComponent } from './components/weather/weather.component';
import { MenuComponent } from './menu/menu.component';
import { HomeComponent } from './home/home.component';
import { ContainerTileComponent } from './components/container-tile/container-tile.component';
import { NumberComponent } from './components/number/number.component';
import { LongPressDirective } from './components/device-tile/long-press.directive';
import { DeviceTileComponent } from './components/device-tile/device-tile.component';
import { DeviceDetailComponent } from './components/device-detail/device-detail.component';
import { SettingsComponent } from './settings/settings.component';


@NgModule({
  declarations: [
    AppComponent,
    SetupComponent,
    HeaderComponent,
    MenuComponent,
    WeatherComponent,
    HomeComponent,
    ContainerTileComponent,
    LongPressDirective,
    DeviceTileComponent,
    DeviceDetailComponent,
    NumberComponent,
    SettingsComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    ChartsModule,
    DragulaModule.forRoot(),
    FlexLayoutModule,
    FormsModule,
    MaterialModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  entryComponents: [
    DeviceDetailComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
