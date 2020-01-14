import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CoreService, GlobalSettings, ConnexionTypes } from '../services/core.service';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss']
})
export class SetupComponent implements OnInit {
  settings: GlobalSettings;
  connexionTypes = ConnexionTypes;

  constructor(
    private router: Router,
    private core: CoreService
  ) { }

  ngOnInit() {
    this.settings = {
      homey: {
        type: this.connexionTypes.Cloud,
        credentials: {
          id: '',
          secret: '',
          token: '',
          url: 'http://localhost'
        }
      },
      darkSky: {
        apiKey: '',
        location: ''
      }
    };
  }

  start() {
    this.core.save('settings', this.settings);
    this.router.navigate(['/']);
  }

  incompletedForm() {
    return !this.settings.homey.type ||
      !this.settings.homey.credentials.id ||
      !this.settings.homey.credentials.secret ||
      !this.settings.homey.credentials.token;
  }

}
