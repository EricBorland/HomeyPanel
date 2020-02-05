import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet, Router, ActivationStart, NavigationEnd } from '@angular/router';
import { CoreService, GlobalSettings } from './services/core.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('header', {
    read: RouterOutlet,
    static: false
  }) header: RouterOutlet;
  @ViewChild('menu', {
    read: RouterOutlet,
    static: false
  }) menu: RouterOutlet;
  @ViewChild('body', {
    read: RouterOutlet,
    static: false
  }) body: RouterOutlet;

  loading = true;
  settings: GlobalSettings;

  constructor(
    private router: Router,
    private core: CoreService
  ) {
    router.events.subscribe((event) => {
      if (event instanceof ActivationStart && this[event.snapshot.outlet]) {
        this[event.snapshot.outlet].deactivate();
      } else if (event instanceof NavigationEnd && event.url === '/') {
        this.ngOnInit();
      }
    });
    this.settings = core.getSettings();
  }

  async ngOnInit(): Promise<void> {
    this.loading = true;
    const settings = this.core.getSettings();
    if (settings.homey && settings.homey.credentials && settings.homey.credentials.id) {
      try {
        await this.core.init();
        this.router.navigate(['/home']);
        this.loading = false;
      } catch (e) {
        this.router.navigate(['/setup']);
        this.loading = false;
      }
    } else {
      this.router.navigate(['/setup']);
      this.loading = false;
    }
  }
}
