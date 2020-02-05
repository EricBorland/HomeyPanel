import { Component, OnDestroy } from '@angular/core';
import { DragulaService } from 'ng2-dragula';
import { CoreService, GlobalSettings, PanelZone } from '../services/core.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnDestroy {
  settings: GlobalSettings;
  zones;
  devices;
  panelZones: PanelZone[];

  constructor(
    private core: CoreService,
    private dragulaService: DragulaService
  ) {
    this.settings = core.getSettings();
    this.zones = core.getZones();
    this.devices = core.getDevices();
    this.panelZones = core.getPanelZones();
  }

  toggleSetting(setting, settingName): void {
    setting[settingName] = !setting[settingName];
    this.core.save('settings', this.settings);
    this.saveZones();
  }

  saveZones(): void {
    this.core.save('panelZones', this.panelZones);
  }

  ngOnDestroy(): void {
    this.dragulaService.destroy('zones');
    //this.dragulaService.destroy('devices');
  }

}
