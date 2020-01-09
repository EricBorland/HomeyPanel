import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { CoreService, PanelZone, PanelDevice, PanelSettings } from '../services/core.service';
import { DeviceDetailComponent } from '../components/device-detail/device-detail.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  zones;
  devices;
  panelZones: PanelZone[];
  type: string = 'action';

  constructor(private core: CoreService, private dialog: MatDialog) { }

  async ngOnInit() {
    this.zones = await this.core.getZones();
    this.devices = await this.core.getDevices();
    this.panelZones = this.core.getDevicesByZone();
  }

  drop(event: CdkDragDrop<string[]>, array: PanelZone[] | PanelDevice[]) {
    moveItemInArray(array, event.previousIndex, event.currentIndex);
    this.core.save('panelZones', this.panelZones);
  }

    /*
  getIcon(device) {
    console.log(device.virtualClass || device.class);
    if (device.name === 'Fireplace') {
      return 'heating-022-fireplace';
    }
    console.log(device.name, device.name === '3x USB Port');
    if (device.name === '3x USB Port') {
      console.log('returning usb');
      return 'mdi-usb';
    }
    if (device.name === 'Water') {
      return 'home-living-055-hose';
    }
    switch (device.virtualClass || device.class) {
      case 'light':
        return 'lighting-025-lamp';
      case 'blinds':
        return 'home-living-052-blinds';
      case 'socket':
        return 'home-living-053-socket';
      case 'heater':
        return 'heating-001-heater';
      case 'tv':
        return 'home-living-043-television';
      case 'homealarm':
        return 'mdi-alarm-light-outline';
      case 'button':
        return 'home-living-051-teapot';
    }
  }
     */

  toggle(event) {
    console.log('toggling device', event);
    /*
    await this.homey.devices.setCapabilityValue({
      deviceId: event.device.id,
      capabilityId: event.capability || event.device.ui.quickAction,
      value: event.value || !event.device.capabilities.onoff.value
    });
     */
  }

  openDeviceDetail(event) {
    const dialog = this.dialog.open(DeviceDetailComponent, {
      data: {
        device: event.device,
        panelDevice: event.panelDevice
      }
    });

    dialog.afterClosed().subscribe(updatedSettings => {
      if (updatedSettings) {
        event.panelDevice.settings = updatedSettings;
        this.core.save('panelZones', this.panelZones);
      }
    });
  }

}
