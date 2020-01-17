import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CoreService } from './services/core.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  loading = true;

  constructor(
    private router: Router,
    private core: CoreService
  ) {
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd && event.url === '/') {
        this.ngOnInit();
      }
    });
  }

  async ngOnInit(): Promise<void> {
    this.loading = true;
    const settings = this.core.getSettings();
    if (settings.homey && settings.homey.credentials && settings.homey.credentials.id) {
      await this.core.init();
      this.router.navigate(['/home']);
      this.loading = false;
    } else {
      this.router.navigate(['/setup']);
      this.loading = false;
    }
  }
}
