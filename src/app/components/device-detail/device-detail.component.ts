import { Component, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DragulaService } from 'ng2-dragula';
import { PanelDevice, CommonSettings } from '../../services/core.service';
import { icons } from  '../../../assets/icons.json';

export interface DeviceDetailData {
  device: any;
  panelDevice: PanelDevice;
}

@Component({
  selector: 'app-device-detail',
  templateUrl: './device-detail.component.html',
  styleUrls: ['./device-detail.component.scss']
})
export class DeviceDetailComponent implements OnDestroy {

  settings: CommonSettings;
  icons: string[];
  availableCapabilities: string[];
  iconFilter: string;
  filtering;
  throttling;

  constructor(
    public dialogRef: MatDialogRef<DeviceDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DeviceDetailData,
    private dragulaService: DragulaService
  ) {
    this.settings = JSON.parse(JSON.stringify(data.panelDevice.settings || '{}'));
    this.settings.info = this.settings.info || [];
    this.availableCapabilities = data.device.capabilities.filter(capability => !this.settings.info.includes(capability) && data.device.capabilitiesObj[capability].getable);
    this.icons = [];
    this.throttle(this.icons, icons);
    dragulaService.createGroup('capabilities', {
      accepts: this.acceptMoreCapabilities.bind(this)
    });
  }

  acceptMoreCapabilities(el?, target?): boolean {
    return target && target.id !== 'selectedCapabilities' || this.settings.info.length < 3;
  }

  close(): void {
    this.dialogRef.close();
  }

  filterIcons(text: string): void {
    if (this.filtering) clearTimeout(this.filtering);
    this.filtering = setTimeout(() => {
      this.icons = [];
      let result = icons;
      if (text) {
        result = icons.filter(icon => icon.includes(text.toLowerCase().trim()));
      }
      this.throttle(this.icons, result);
    }, 250);
  }

  throttle(array, items, index = 0): void {
    if (this.throttling) clearTimeout(this.throttling);
    if (!items[index]) return;
    array.push(items[index]);
    this.throttling = setTimeout(() => {
      this.throttle(array, items, index + 1);
    });
  }

  roomForMoreCapabilities(targetId?: string): boolean {
    return targetId !== 'selectedCapabilities' || this.settings && this.settings.info && this.settings.info.length < 3;
  }

  trackBy(index: number): number {
    return index;
  }

  transfer(from: string[], to: string[], index: number): void {
    if (to !== this.settings.info || this.roomForMoreCapabilities()) {
      to.push(from[index]);
      from.splice(index, 1);
    }
  }

  ngOnDestroy(): void {
    if (this.filtering) clearTimeout(this.filtering);
    if (this.throttling) clearTimeout(this.throttling);
    this.dragulaService.destroy('capabilities');
  }

}
