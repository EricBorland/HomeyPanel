import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ChartsModule } from 'ng2-charts';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';

import { MaterialModule } from './material.module';
import { HomeComponent } from './home/home.component';
import { ContainerTileComponent } from './components/container-tile/container-tile.component';
import { NumberComponent } from './components/number/number.component';
import { DeviceTileComponent } from './components/device-tile/device-tile.component';
import { HeaderComponent } from './header/header.component';
import { WeatherComponent } from './components/weather/weather.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ContainerTileComponent,
    DeviceTileComponent,
    NumberComponent,
    HeaderComponent,
    WeatherComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    FlexLayoutModule,
    ChartsModule,
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
