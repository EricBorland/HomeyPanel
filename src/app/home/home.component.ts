import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { CoreService, PanelZone, PanelDevice } from '../services/core.service';
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
  type = 'action';

  constructor(private core: CoreService, private dialog: MatDialog) { }

  async ngOnInit(): Promise<void> {
    this.zones = await this.core.getZones();
    this.devices = await this.core.getDevices();
    this.panelZones = this.core.getPanelZones();
  }

  drop(event: CdkDragDrop<string[]>, array: PanelZone[] | PanelDevice[]): void {
    moveItemInArray(array, event.previousIndex, event.currentIndex);
    this.core.save('panelZones', this.panelZones);
  }

  async toggle(event): Promise<void> {
    if (event.device.ready) {
      await this.core.quickAction(event.device, event.panelDevice);
    }
  }

  openDeviceDetail(event): void {
    if (event.device.ready) {
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

}
