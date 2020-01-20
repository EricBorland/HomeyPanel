import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { PanelDevice } from '../../services/core.service';

@Component({
  selector: 'device-tile',
  templateUrl: './device-tile.component.html',
  styleUrls: ['./device-tile.component.scss']
})
export class DeviceTileComponent implements OnInit {

  @Input() device: any;
  @Input() panelDevice: PanelDevice;
  @Output() singlePress = new EventEmitter();
  @Output() longPress = new EventEmitter();

  capabilities;

  ngOnInit(): void {
    this.capabilities = this.device.capabilitiesObj || {};
    this.device.capabilities.forEach(capability => {
      this.capabilities[capability] = this.capabilities[capability] || {};
    });
  }

  getValue(info): boolean | number {
    if (this.capabilities[info].units === '%') {
      const scale = 100 / (this.capabilities[info].max - this.capabilities[info].min);
      return this.capabilities[info].value * scale - this.capabilities[info].min;
    }
    return this.capabilities[info].value;
  }

  onPress(event): void {
    this.singlePress.emit({
      ...event,
      device: this.device,
      panelDevice: this.panelDevice
    });
  }

  onLongPress(event): void {
    this.longPress.emit({
      ...event,
      device: this.device,
      panelDevice: this.panelDevice
    });
  }

}
