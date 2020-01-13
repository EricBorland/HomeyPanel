import { Component, OnInit } from '@angular/core';

const ONE_SECOND = 1000;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  now: number;

  constructor() { }

  ngOnInit() {
    setInterval(() => { this.now = Date.now() }, ONE_SECOND);
  }

}
