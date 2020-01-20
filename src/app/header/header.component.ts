import { Component, OnInit } from '@angular/core';
import { CoreService, DarkSkySettings } from '../services/core.service';

const ONE_SECOND = 1000;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  now: number;
  weatherSettings: DarkSkySettings;

  constructor(
    private core: CoreService
  ) {
    const settings = this.core.getSettings();
    this.weatherSettings = settings.darkSky;
  }

  ngOnInit(): void {
    setInterval(() => { this.now = Date.now(); }, ONE_SECOND);
  }

}
