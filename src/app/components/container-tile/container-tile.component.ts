import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'container-tile',
  templateUrl: './container-tile.component.html',
  styleUrls: ['./container-tile.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class ContainerTileComponent implements OnInit {

  @Input() title: string;
  @Input() subtitle: string;

  constructor() { }

  ngOnInit() {
  }

}
