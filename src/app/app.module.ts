import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialModule } from './material.module';

import { HomeComponent } from './home/home.component';
import { ContainerTileComponent } from './components/container-tile/container-tile.component';
import { NumberComponent } from './components/number/number.component';
import { DeviceTileComponent } from './components/device-tile/device-tile.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ContainerTileComponent,
    DeviceTileComponent,
    NumberComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    BrowserAnimationsModule,
    FlexLayoutModule,
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
