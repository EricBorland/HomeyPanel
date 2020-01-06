import { Component, EventEmitter, OnInit, Input, Output, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'device-tile',
  templateUrl: './device-tile.component.html',
  styleUrls: ['./device-tile.component.scss']
})
export class DeviceTileComponent implements OnInit {

  @Input() device: any;
  @Output() toggle =  new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  toggleOnOff(device) {
    this.toggle.emit({
      device: device
    });
  }

}
