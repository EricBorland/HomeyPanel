import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { PanelDevice, PanelSettings } from '../../services/core.service';
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
export class DeviceDetailComponent {

  settings: PanelSettings;
  icons: string[];
  availableCapabilities: string[];
  iconFilter: string;
  filtering;

  constructor(
    public dialogRef: MatDialogRef<DeviceDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DeviceDetailData
  ) {
    this.settings = JSON.parse(JSON.stringify(data.panelDevice.settings));
    this.availableCapabilities = data.device.capabilities.filter(capability => !this.settings.info.includes(capability) && data.device.capabilitiesObj[capability].getable);
    this.icons = [];
    this.throttle(this.icons, icons);
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
    if (!items[index]) return;
    array.push(items[index]);
    setTimeout(() => {
      this.throttle(array, items, index + 1);
    });
  }

  drop(event: CdkDragDrop<string[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  roomForMoreCapabilities(): boolean {
    return this.settings && this.settings.info && this.settings.info.length < 3;
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

}
