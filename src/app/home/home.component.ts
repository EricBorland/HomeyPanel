import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DragulaService } from 'ng2-dragula';
import { CoreService, PanelZone } from '../services/core.service';
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

  constructor(
    private core: CoreService,
    private dialog: MatDialog,
    private dragulaService: DragulaService
  ) {
    dragulaService.createGroup('zones', {
      invalid: (el) => el.tagName === 'DEVICE-TILE'
    });
    dragulaService.createGroup('devices', {
      accepts: (el, target, source) => target.id === source.id,
      invalid: (el, handle) => handle.className !== 'device-handle'
    });
  }

  async ngOnInit(): Promise<void> {
    this.zones = this.core.getZones();
    this.devices = this.core.getDevices();
    this.panelZones = this.core.getPanelZones();
  }

  saveZones(): void {
    this.core.save('panelZones', this.panelZones);
  }

  async toggle(event): Promise<void> {
    if (event.device.ready) {
      await this.core.setCapability(event.device, event.panelDevice);
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

  async onDimmed(event): Promise<void> {
    if (event.device.ready) {
      await this.core.setCapability(event.device, event.panelDevice, event.dimming.capability, event.dimming.value);
    }

  }

}
