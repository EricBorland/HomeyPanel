import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CoreService, GlobalSettings } from '../services/core.service';

const ONE_SECOND = 1000;

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  section = 'home';
  settings: GlobalSettings;
  now: number = Date.now();

  constructor(
    private core: CoreService,
    private router: Router
  ) {
    this.section = router.url;
    this.settings = core.getSettings();
  }

  ngOnInit(): void {
    setInterval(() => { this.now = Date.now(); }, ONE_SECOND);
  }

}
