import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { PanelDevice, UNIT_PERCENT, CHART_SLIDER, UI_SLIDER } from '../../services/core.service';

export enum DimmableCapability {
  /* eslint-disable @typescript-eslint/camelcase */
  /* camelcase rule is disabled here since that's
   * how Athom named the capabilities */
  dim = 0,
  volume_set = 1,
  windowcoverings_set = 2,
  windowcoverings_tilt_set = 3
  /* eslint-enable @typescript-eslint/camelcase */
}

export interface DimmingLevel {
  percent: number;
  value: number;
  capability: string;
}

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
  @Output() verticalPanning = new EventEmitter();
  @Output() verticalPanned = new EventEmitter();
  @Output() horizontalPanning = new EventEmitter();
  @Output() horizontalPanned = new EventEmitter();

  capabilities;
  toggleable = '';
  dimmable = '';
  dimming = -1;
  dimmingBackground = '';

  ngOnInit(): void {
    this.capabilities = this.device.capabilitiesObj || {};
    this.device.capabilities.forEach(capability => {
      this.capabilities[capability] = this.capabilities[capability] || {};
      this.capabilities[capability].scale = 100 / (this.capabilities[capability].max - this.capabilities[capability].min);
    });
    this.toggleable = this.device.ui && this.device.ui.quickAction;
    const dimmable = (this.device.ui.components || []).find(component => component.id === UI_SLIDER);
    if (dimmable && this.device.ready && this.device.available) {
      this.dimmable = DimmableCapability[Math.min(...dimmable.capabilities.map(capability => DimmableCapability[capability]))];
    }
  }

  getValue(info): boolean | number {
    const capability = this.capabilities[info];
    if (capability.units === UNIT_PERCENT || (capability.charType === CHART_SLIDER && capability.max && capability.min)) {
      return this.getScaledValue(capability);
    }
    return capability.value;
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

  onVerticalPanning(event): void {
    const dimming = this.getDimmingLevel(event);
    this.dimming = dimming.percent;
    // TODO use Palette API to get the accent color
    this.dimmingBackground = `-webkit-linear-gradient(90deg, rgba(255, 135, 0, ${(this.dimming / 350) + 0.7}) ${this.dimming}%, rgba(0, 0, 0, 0.75) ${this.dimming}%)`;
    this.verticalPanning.emit({
      ...event,
      device: this.device,
      panelDevice: this.panelDevice,
      dimming: dimming
    });
  }

  onVerticalPanned(event): void {
    const dimming = this.getDimmingLevel(event);
    this.verticalPanned.emit({
      ...event,
      device: this.device,
      panelDevice: this.panelDevice,
      dimming: dimming
    });
    this.dimming = -1;
    this.dimmingBackground = '';
  }

  onHorizontalPanning(event): void {
    this.horizontalPanning.emit({
      ...event,
      device: this.device,
      panelDevice: this.panelDevice
    });
  }

  onHorizontalPanned(event): void {
    this.horizontalPanned.emit({
      ...event,
      device: this.device,
      panelDevice: this.panelDevice
    });
  }

  getDimmingLevel(event): DimmingLevel {
    const capability = this.capabilities[this.dimmable];
    const percent = Math.max(Math.min(event.elementCoords.relativeY * 100, 100), 0);
    return {
      percent: percent,
      value: this.getRealValue(percent, capability),
      capability: this.dimmable
    };
  }

  getScaledValue(capability): number {
    return capability.value * capability.scale - capability.min;
  }

  getRealValue(value, capability): number {
    return (value + capability.min) / capability.scale;
  }

}
