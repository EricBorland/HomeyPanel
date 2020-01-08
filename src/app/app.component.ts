import { Component, OnInit } from '@angular/core';
import { CoreService } from './services/core.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  loading = true;

  constructor(
    private core: CoreService,
    private router: Router
  ) { }

  async ngOnInit() {
    document.body.style.zoom = '80%';
    await this.core.init();
    this.router.navigate(['/home']);
    this.loading = false;
  }
}
